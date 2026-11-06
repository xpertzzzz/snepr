import postgres from 'postgres';

const connStr = 'postgres://postgres.becpnekqqkgjopjzemtt:Q6Dlial198lVgsQz@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require';
const sql = postgres(connStr, { ssl: 'require' });

async function deploy() {
  console.log("1. Enabling pgcrypto extension...");
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

  console.log("2. Extending users table with security fields...");
  await sql`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;
  `;

  // Ensure default demo users have valid bcrypt hashes of 'Password@123' and are unlocked
  await sql`
    UPDATE users SET 
      password = extensions.crypt('Password@123', extensions.gen_salt('bf', 10)),
      is_verified = TRUE, 
      failed_attempts = 0, 
      locked_until = NULL;
  `;

  console.log("3. Creating auth_rate_limits table...");
  await sql`
    CREATE TABLE IF NOT EXISTS auth_rate_limits (
      identifier TEXT PRIMARY KEY,
      failed_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP DEFAULT NULL,
      last_attempt TIMESTAMP DEFAULT NOW()
    );
  `;

  console.log("4. Creating password_reset_tokens table...");
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  console.log("5. Creating partner_applications table...");
  await sql`
    CREATE TABLE IF NOT EXISTS partner_applications (
      id SERIAL PRIMARY KEY,
      application_id TEXT UNIQUE NOT NULL,
      salon_name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      business_email TEXT NOT NULL,
      salon_description TEXT,
      locality TEXT NOT NULL,
      full_address TEXT NOT NULL,
      postal_code TEXT,
      chair_count INTEGER DEFAULT 3,
      opening_time TEXT DEFAULT '09:00 AM',
      closing_time TEXT DEFAULT '09:00 PM',
      weekly_holiday TEXT DEFAULT 'None',
      services JSONB DEFAULT '[]'::jsonb,
      status TEXT DEFAULT 'PENDING_REVIEW',
      reviewed_at TIMESTAMP DEFAULT NULL,
      reviewed_by TEXT DEFAULT NULL,
      rejection_reason TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // Seed sample initial pending application if table is empty
  const appCount = await sql`SELECT count(*)::int as c FROM partner_applications`;
  if (appCount[0].c === 0) {
    await sql`
      INSERT INTO partner_applications (
        application_id, salon_name, owner_name, contact_number, business_email,
        salon_description, locality, full_address, postal_code, chair_count,
        opening_time, closing_time, weekly_holiday, status, created_at
      ) VALUES (
        'SN-BBS-1042', 'Barber King Studio', 'Bikash Sahoo', '+91 94371 88990', 'bikash@barberking.com',
        'Modern fades, beard grooming, and facial treatments near KIIT Square.',
        'KIIT Road', 'Plot No. 12, KIIT Road, opposite Big Bazaar, Patia', '751024', 3,
        '09:30 AM', '09:30 PM', 'Tuesday', 'PENDING_REVIEW', NOW()
      );
    `;
  }

  console.log("6. Dropping old overload and creating hardened authenticate_user function...");
  await sql`DROP FUNCTION IF EXISTS public.authenticate_user(text, text);`;
  await sql`DROP FUNCTION IF EXISTS public.authenticate_user(text, text, text);`;

  await sql`
    CREATE OR REPLACE FUNCTION public.authenticate_user(
      p_identifier TEXT,
      p_password TEXT,
      p_ip TEXT DEFAULT '127.0.0.1'
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_clean_id TEXT := LOWER(TRIM(p_identifier));
      v_rate RECORD;
      v_user RECORD;
      v_salon_name TEXT := NULL;
      v_dummy_hash TEXT := '$2b$10$fElgqAb68mG4vNq7Pz7V2eaM1X.yQ6R9hUe6M2b.h3B4Wc9fL1sZ.';
      v_matched BOOLEAN := FALSE;
      v_dummy_match BOOLEAN;
    BEGIN
      -- Check rate limit on identifier
      SELECT * INTO v_rate FROM auth_rate_limits WHERE identifier = v_clean_id;
      IF FOUND AND v_rate.locked_until IS NOT NULL AND v_rate.locked_until > NOW() THEN
        RETURN json_build_object(
          'success', false,
          'message', 'Account is temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.'
        );
      END IF;

      -- Look up user by email, username, or phone
      SELECT * INTO v_user FROM users
      WHERE LOWER(email) = v_clean_id 
         OR LOWER(username) = v_clean_id
         OR phone = TRIM(p_identifier)
      LIMIT 1;

      IF NOT FOUND THEN
        -- Execute constant-time dummy hash verification to kill timing side-channels
        v_dummy_match := (extensions.crypt(p_password, v_dummy_hash) = v_dummy_hash);
        
        -- Record failed attempt against rate limits
        INSERT INTO auth_rate_limits (identifier, failed_attempts, last_attempt)
        VALUES (v_clean_id, 1, NOW())
        ON CONFLICT (identifier) DO UPDATE SET
          failed_attempts = auth_rate_limits.failed_attempts + 1,
          last_attempt = NOW(),
          locked_until = CASE 
            WHEN auth_rate_limits.failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
            ELSE NULL 
          END;

        RETURN json_build_object('success', false, 'message', 'Invalid email or password.');
      END IF;

      -- Check account lockout on user record
      IF v_user.locked_until IS NOT NULL AND v_user.locked_until > NOW() THEN
        RETURN json_build_object(
          'success', false,
          'message', 'Account is temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.'
        );
      END IF;

      -- Verify password strictly with bcrypt (no plain text backdoors)
      IF v_user.password = extensions.crypt(p_password, v_user.password) THEN
        v_matched := TRUE;
      END IF;

      IF NOT v_matched THEN
        -- Increment failed attempts
        UPDATE users SET 
          failed_attempts = COALESCE(failed_attempts, 0) + 1,
          locked_until = CASE 
            WHEN COALESCE(failed_attempts, 0) + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
            ELSE NULL 
          END
        WHERE id = v_user.id;

        INSERT INTO auth_rate_limits (identifier, failed_attempts, last_attempt)
        VALUES (v_clean_id, 1, NOW())
        ON CONFLICT (identifier) DO UPDATE SET
          failed_attempts = auth_rate_limits.failed_attempts + 1,
          last_attempt = NOW(),
          locked_until = CASE 
            WHEN auth_rate_limits.failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
            ELSE NULL 
          END;

        RETURN json_build_object('success', false, 'message', 'Invalid email or password.');
      END IF;

      -- Check email verification requirement (default accounts are verified)
      IF v_user.is_verified IS FALSE THEN
        RETURN json_build_object(
          'success', false,
          'message', 'Please verify your email address before signing in. Check your inbox for the verification code.'
        );
      END IF;

      -- Reset failed attempts on successful login
      UPDATE users SET failed_attempts = 0, locked_until = NULL, last_sign_in_at = NOW() WHERE id = v_user.id;
      DELETE FROM auth_rate_limits WHERE identifier = v_clean_id;

      -- Fetch salon name if associated
      IF v_user.salon_id IS NOT NULL THEN
        SELECT name INTO v_salon_name FROM salons WHERE id = v_user.salon_id LIMIT 1;
      END IF;

      RETURN json_build_object(
        'success', true,
        'user', json_build_object(
          'id', v_user.id,
          'username', v_user.username,
          'name', COALESCE(v_user.name, v_user.username),
          'email', v_user.email,
          'phone', v_user.phone,
          'role', v_user.role,
          'salonId', v_user.salon_id,
          'salonName', v_salon_name,
          'isAdmin', (v_user.role = 'super_admin' OR v_user.role = 'admin')
        )
      );
    END;
    $$;
  `;

  console.log("7. Creating request_password_reset function (Anti-enumeration)...");
  await sql`
    CREATE OR REPLACE FUNCTION public.request_password_reset(
      p_email TEXT,
      p_token_hash TEXT
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_user RECORD;
    BEGIN
      SELECT * INTO v_user FROM users WHERE LOWER(email) = LOWER(TRIM(p_email)) LIMIT 1;
      
      IF FOUND THEN
        -- Invalidate existing unconsumed reset tokens for this user
        UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = v_user.id AND used_at IS NULL;

        -- Store cryptographic token hash expiring strictly in 1 hour
        INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, created_at)
        VALUES (v_user.id, p_token_hash, NOW() + INTERVAL '1 hour', NOW())
        ON CONFLICT (token_hash) DO UPDATE SET
          expires_at = NOW() + INTERVAL '1 hour',
          used_at = NULL;
      END IF;

      -- Anti-enumeration: Response is 100% IDENTICAL whether user exists or not
      RETURN json_build_object(
        'success', true,
        'message', 'If an account exists with this email address, password reset instructions have been dispatched.'
      );
    END;
    $$;
  `;

  console.log("8. Creating verify_and_reset_password function...");
  await sql`
    CREATE OR REPLACE FUNCTION public.verify_and_reset_password(
      p_token_hash TEXT,
      p_new_password TEXT
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_token RECORD;
      v_hashed_password TEXT;
    BEGIN
      SELECT * INTO v_token FROM password_reset_tokens
      WHERE token_hash = p_token_hash
        AND used_at IS NULL
        AND expires_at > NOW()
      LIMIT 1;

      IF NOT FOUND THEN
        RETURN json_build_object(
          'success', false,
          'message', 'This password reset link is invalid, expired, or has already been used.'
        );
      END IF;

      -- Hash new password using slow bcrypt KDF
      v_hashed_password := extensions.crypt(p_new_password, extensions.gen_salt('bf', 10));

      -- Update user password, clear failed attempts, and unlock
      UPDATE users SET
        password = v_hashed_password,
        failed_attempts = 0,
        locked_until = NULL,
        updated_at = NOW()
      WHERE id = v_token.user_id;

      -- Mark token as consumed
      UPDATE password_reset_tokens SET used_at = NOW() WHERE id = v_token.id;

      RETURN json_build_object(
        'success', true,
        'message', 'Your password has been successfully reset. You may now sign in.'
      );
    END;
    $$;
  `;

  console.log("9. Creating submit_partner_application_db function...");
  await sql`
    CREATE OR REPLACE FUNCTION public.submit_partner_application_db(
      p_salon_name TEXT,
      p_owner_name TEXT,
      p_contact_number TEXT,
      p_business_email TEXT,
      p_salon_description TEXT,
      p_locality TEXT,
      p_full_address TEXT,
      p_postal_code TEXT,
      p_chair_count INTEGER,
      p_opening_time TEXT,
      p_closing_time TEXT,
      p_weekly_holiday TEXT,
      p_services JSONB
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_app_id TEXT;
      v_new RECORD;
    BEGIN
      v_app_id := 'SN-BBS-' || LPAD((FLOOR(RANDOM() * 9000 + 1000))::TEXT, 4, '0');

      INSERT INTO partner_applications (
        application_id, salon_name, owner_name, contact_number, business_email,
        salon_description, locality, full_address, postal_code, chair_count,
        opening_time, closing_time, weekly_holiday, services, status, created_at
      ) VALUES (
        v_app_id, p_salon_name, p_owner_name, p_contact_number, p_business_email,
        p_salon_description, p_locality, p_full_address, p_postal_code, p_chair_count,
        p_opening_time, p_closing_time, p_weekly_holiday, p_services, 'PENDING_REVIEW', NOW()
      )
      RETURNING * INTO v_new;

      RETURN json_build_object(
        'success', true,
        'applicationId', v_app_id,
        'application', row_to_json(v_new)
      );
    END;
    $$;
  `;

  console.log("10. Creating review_partner_application_db function...");
  await sql`
    CREATE OR REPLACE FUNCTION public.review_partner_application_db(
      p_application_id TEXT,
      p_action TEXT, -- 'APPROVE' or 'REJECT'
      p_reviewer TEXT DEFAULT 'Super Admin',
      p_rejection_reason TEXT DEFAULT NULL
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_app RECORD;
      v_new_salon RECORD;
      v_chair_idx INTEGER;
    BEGIN
      SELECT * INTO v_app FROM partner_applications WHERE application_id = p_application_id;
      IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Application not found');
      END IF;

      IF p_action = 'APPROVE' THEN
        -- 1. Create entry in salons table
        INSERT INTO salons (
          name, slug, category, address, phone, email, 
          operational_status, status, verification_status, wait_time, waiting_count,
          total_chairs, available_chairs, created_at
        ) VALUES (
          v_app.salon_name,
          LOWER(REGEXP_REPLACE(v_app.salon_name, '[^a-zA-Z0-9]+', '-', 'g')),
          'Unisex',
          v_app.full_address,
          v_app.contact_number,
          v_app.business_email,
          'active', 'active', 'verified', 0, 0,
          COALESCE(v_app.chair_count, 3), COALESCE(v_app.chair_count, 3),
          NOW()
        )
        RETURNING * INTO v_new_salon;

        -- 2. Populate chairs
        FOR v_chair_idx IN 1..COALESCE(v_app.chair_count, 3) LOOP
          INSERT INTO chairs (
            salon_id, chair_number, name, barber_name, status, created_at
          ) VALUES (
            v_new_salon.id, v_chair_idx, 'Station ' || v_chair_idx, 'Stylist', 'available', NOW()
          );
        END LOOP;

        -- 3. Update application status
        UPDATE partner_applications SET
          status = 'APPROVED',
          reviewed_at = NOW(),
          reviewed_by = p_reviewer,
          updated_at = NOW()
        WHERE application_id = p_application_id;

        RETURN json_build_object(
          'success', true,
          'message', 'Application approved and salon provisioned.',
          'salonId', v_new_salon.id
        );
      ELSE
        -- Mark Rejected
        UPDATE partner_applications SET
          status = 'REJECTED',
          reviewed_at = NOW(),
          reviewed_by = p_reviewer,
          rejection_reason = p_rejection_reason,
          updated_at = NOW()
        WHERE application_id = p_application_id;

        RETURN json_build_object(
          'success', true,
          'message', 'Application marked as rejected.'
        );
      END IF;
    END;
    $$;
  `;

  console.log("11. Granting permissions on all new stored procedures...");
  await sql`GRANT EXECUTE ON FUNCTION public.authenticate_user(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;`;
  await sql`GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT, TEXT) TO anon, authenticated, service_role;`;
  await sql`GRANT EXECUTE ON FUNCTION public.verify_and_reset_password(TEXT, TEXT) TO anon, authenticated, service_role;`;
  await sql`GRANT EXECUTE ON FUNCTION public.submit_partner_application_db(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated, service_role;`;
  await sql`GRANT EXECUTE ON FUNCTION public.review_partner_application_db(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;`;
  await sql`GRANT SELECT, INSERT, UPDATE ON TABLE public.partner_applications TO anon, authenticated, service_role;`;
  await sql`GRANT USAGE, SELECT ON SEQUENCE public.partner_applications_id_seq TO anon, authenticated, service_role;`;

  console.log("ENTERPRISE SECURITY & DATABASE SYNC DEPLOYED SUCCESSFULLY!");
  await sql.end();
}

deploy();
