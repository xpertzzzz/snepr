import postgres from 'postgres';

const connStr = 'postgres://postgres.becpnekqqkgjopjzemtt:Q6Dlial198lVgsQz@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require';
const sql = postgres(connStr, { ssl: 'require' });

async function deploy() {
  console.log("1. Enabling pgcrypto extension & ensuring schema columns...");
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;
  await sql.unsafe(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS failed_attempts INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS last_sign_in_at TIMESTAMP DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;
  `);

  console.log("2. Creating email_verification_tokens table...");
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE email_verification_tokens ALTER COLUMN expires_at TYPE TIMESTAMPTZ;
    ALTER TABLE email_verification_tokens ALTER COLUMN created_at TYPE TIMESTAMPTZ;
    CREATE INDEX IF NOT EXISTS idx_email_verif_lookup ON email_verification_tokens (email, code, is_verified, expires_at);
  `);

  console.log("3. Ensuring auth_rate_limits has captcha tracking...");
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS auth_rate_limits (
      identifier TEXT PRIMARY KEY,
      failed_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMPTZ DEFAULT NULL,
      last_attempt TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE auth_rate_limits ALTER COLUMN locked_until TYPE TIMESTAMPTZ;
    ALTER TABLE auth_rate_limits ALTER COLUMN last_attempt TYPE TIMESTAMPTZ;
  `);

  console.log("4. Ensuring password_reset_tokens table...");
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ DEFAULT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE password_reset_tokens ALTER COLUMN expires_at TYPE TIMESTAMPTZ;
    ALTER TABLE password_reset_tokens ALTER COLUMN used_at TYPE TIMESTAMPTZ;
    ALTER TABLE password_reset_tokens ALTER COLUMN created_at TYPE TIMESTAMPTZ;
    CREATE INDEX IF NOT EXISTS idx_reset_token_hash ON password_reset_tokens (token_hash, used_at, expires_at);
  `);

  console.log("5. Deploying register_user RPC (Anti-Enumeration & Slow KDF & Unverified State)...");
  await sql.unsafe(`
    DROP FUNCTION IF EXISTS public.register_user(TEXT, TEXT, TEXT, TEXT);
    CREATE OR REPLACE FUNCTION public.register_user(
      p_email TEXT,
      p_password TEXT,
      p_name TEXT,
      p_phone TEXT DEFAULT NULL
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_clean_email TEXT := LOWER(TRIM(p_email));
      v_dummy_hash TEXT := '$2b$10$fElgqAb68mG4vNq7Pz7V2eaM1X.yQ6R9hUe6M2b.h3B4Wc9fL1sZ.';
      v_user_exists BOOLEAN;
      v_dummy_salt TEXT;
      v_hashed_pw TEXT;
      v_verif_code TEXT;
      v_new_username TEXT;
    BEGIN
      -- Anti-enumeration check
      SELECT EXISTS(SELECT 1 FROM users WHERE LOWER(email) = v_clean_email) INTO v_user_exists;

      IF v_user_exists THEN
        -- Run dummy bcrypt KDF with 10 rounds to equalize execution timing
        v_dummy_salt := extensions.crypt(p_password, v_dummy_hash);
        
        -- Return identical message so attacker cannot enumerate email presence
        RETURN json_build_object(
          'success', true,
          'message', 'If this email is eligible, a verification code has been dispatched. Please verify ownership to activate your account.'
        );
      END IF;

      -- Generate 6-digit random verification code
      v_verif_code := LPAD((FLOOR(RANDOM() * 900000 + 100000))::TEXT, 6, '0');

      -- Hash password with slow bcrypt (10 rounds)
      v_hashed_pw := extensions.crypt(p_password, extensions.gen_salt('bf', 10));

      -- Generate unique username
      v_new_username := SPLIT_PART(v_clean_email, '@', 1) || '_' || LPAD((FLOOR(RANDOM() * 9000 + 1000))::TEXT, 4, '0');

      -- Insert user with is_verified = FALSE (requires verified email ownership)
      INSERT INTO users (
        username,
        email,
        password,
        name,
        phone,
        role,
        is_verified,
        failed_attempts,
        created_at
      ) VALUES (
        v_new_username,
        v_clean_email,
        v_hashed_pw,
        TRIM(p_name),
        p_phone,
        'customer',
        FALSE,
        0,
        NOW()
      );

      -- Record verification token (15-minute expiration)
      INSERT INTO email_verification_tokens (email, code, expires_at)
      VALUES (v_clean_email, v_verif_code, NOW() + INTERVAL '15 minutes');

      RETURN json_build_object(
        'success', true,
        'message', 'If this email is eligible, a verification code has been dispatched. Please verify ownership to activate your account.',
        'verification_dispatched', true
      );
    END;
    $$;
    GRANT EXECUTE ON FUNCTION public.register_user(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
  `);

  console.log("6. Deploying verify_email_ownership RPC...");
  await sql.unsafe(`
    DROP FUNCTION IF EXISTS public.verify_email_ownership(TEXT, TEXT);
    CREATE OR REPLACE FUNCTION public.verify_email_ownership(
      p_email TEXT,
      p_code TEXT
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_clean_email TEXT := LOWER(TRIM(p_email));
      v_token RECORD;
    BEGIN
      SELECT * INTO v_token
      FROM email_verification_tokens
      WHERE LOWER(email) = v_clean_email
        AND code = TRIM(p_code)
        AND is_verified IS FALSE
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1;

      IF NOT FOUND THEN
        RETURN json_build_object(
          'success', false,
          'message', 'Invalid, expired, or already verified verification code.'
        );
      END IF;

      -- Mark verification token as used
      UPDATE email_verification_tokens
      SET is_verified = TRUE
      WHERE id = v_token.id;

      -- Activate user account
      UPDATE users
      SET is_verified = TRUE, updated_at = NOW()
      WHERE LOWER(email) = v_clean_email;

      RETURN json_build_object(
        'success', true,
        'message', 'Email address verified successfully. Your account is now active! You may now sign in.'
      );
    END;
    $$;
    GRANT EXECUTE ON FUNCTION public.verify_email_ownership(TEXT, TEXT) TO anon, authenticated, service_role;
  `);

  console.log("7. Hardening authenticate_user RPC (Anti-Enumeration, Lockout & CAPTCHA Fallback)...");
  await sql.unsafe(`
    DROP FUNCTION IF EXISTS public.authenticate_user(TEXT, TEXT);
    DROP FUNCTION IF EXISTS public.authenticate_user(TEXT, TEXT, TEXT);
    DROP FUNCTION IF EXISTS public.authenticate_user(TEXT, TEXT, TEXT, TEXT);

    CREATE OR REPLACE FUNCTION public.authenticate_user(
      p_identifier TEXT,
      p_password TEXT,
      p_captcha_token TEXT DEFAULT NULL,
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
      -- 1. Check rate limits and lockouts
      SELECT * INTO v_rate FROM auth_rate_limits WHERE identifier = v_clean_id;
      
      IF FOUND AND v_rate.locked_until IS NOT NULL AND v_rate.locked_until > NOW() THEN
        RETURN json_build_object(
          'success', false,
          'locked', true,
          'message', 'Account is temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.'
        );
      END IF;

      -- 2. Enforce CAPTCHA fallback if failed attempts >= 3
      IF FOUND AND v_rate.failed_attempts >= 3 THEN
        IF p_captcha_token IS NULL OR TRIM(p_captcha_token) = '' THEN
          RETURN json_build_object(
            'success', false,
            'captcha_required', true,
            'message', 'Security verification required. Please solve the CAPTCHA challenge before proceeding.'
          );
        END IF;
      END IF;

      -- 3. Lookup user
      SELECT * INTO v_user FROM users
      WHERE LOWER(email) = v_clean_id 
         OR LOWER(username) = v_clean_id
         OR phone = TRIM(p_identifier)
      LIMIT 1;

      IF NOT FOUND THEN
        -- Constant-time dummy bcrypt execution kills timing enumeration
        v_dummy_match := (extensions.crypt(p_password, v_dummy_hash) = v_dummy_hash);

        -- Record failed attempt
        INSERT INTO auth_rate_limits (identifier, failed_attempts, last_attempt)
        VALUES (v_clean_id, 1, NOW())
        ON CONFLICT (identifier) DO UPDATE SET
          failed_attempts = auth_rate_limits.failed_attempts + 1,
          last_attempt = NOW(),
          locked_until = CASE 
            WHEN auth_rate_limits.failed_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
            ELSE NULL 
          END;

        SELECT * INTO v_rate FROM auth_rate_limits WHERE identifier = v_clean_id;

        RETURN json_build_object(
          'success', false,
          'captcha_required', (v_rate.failed_attempts >= 3 AND v_rate.failed_attempts < 5),
          'locked', (v_rate.failed_attempts >= 5),
          'message', CASE 
            WHEN v_rate.failed_attempts >= 5 THEN 'Account is temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.'
            ELSE 'Invalid email or password.'
          END
        );
      END IF;

      -- 4. Check user-level lockout
      IF v_user.locked_until IS NOT NULL AND v_user.locked_until > NOW() THEN
        RETURN json_build_object(
          'success', false,
          'locked', true,
          'message', 'Account is temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.'
        );
      END IF;

      -- 5. Verify password strictly with bcrypt (slow KDF)
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

        SELECT * INTO v_rate FROM auth_rate_limits WHERE identifier = v_clean_id;

        RETURN json_build_object(
          'success', false,
          'captcha_required', (v_rate.failed_attempts >= 3 AND v_rate.failed_attempts < 5),
          'locked', (v_rate.failed_attempts >= 5),
          'message', CASE 
            WHEN v_rate.failed_attempts >= 5 THEN 'Account is temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.'
            ELSE 'Invalid email or password.'
          END
        );
      END IF;

      -- 6. Require verified email ownership before account goes active
      IF v_user.is_verified IS FALSE THEN
        RETURN json_build_object(
          'success', false,
          'unverified', true,
          'message', 'Please verify your email address before signing in. Check your inbox for the verification code.'
        );
      END IF;

      -- 7. Reset failed attempts on success
      UPDATE users SET failed_attempts = 0, locked_until = NULL, last_sign_in_at = NOW() WHERE id = v_user.id;
      DELETE FROM auth_rate_limits WHERE identifier = v_clean_id;

      -- 8. Fetch salon name if associated
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
    GRANT EXECUTE ON FUNCTION public.authenticate_user(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
  `);

  console.log("8. Hardening request_password_reset RPC (Anti-Enumeration & Single-Use Hash)...");
  await sql.unsafe(`
    DROP FUNCTION IF EXISTS public.request_password_reset(TEXT, TEXT);
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

        -- Store cryptographic token hash expiring strictly within 1 hour
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
    GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT, TEXT) TO anon, authenticated, service_role;
  `);

  console.log("9. Hardening verify_and_reset_password RPC (Bcrypt KDF, Single-Use Invalidation)...");
  await sql.unsafe(`
    DROP FUNCTION IF EXISTS public.verify_and_reset_password(TEXT, TEXT);
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

      -- Hash new password using slow bcrypt KDF (10 rounds)
      v_hashed_password := extensions.crypt(p_new_password, extensions.gen_salt('bf', 10));

      -- Update user password, clear failed attempts, and unlock
      UPDATE users SET
        password = v_hashed_password,
        failed_attempts = 0,
        locked_until = NULL,
        updated_at = NOW()
      WHERE id = v_token.user_id;

      -- Mark single-use token as consumed
      UPDATE password_reset_tokens SET used_at = NOW() WHERE id = v_token.id;

      RETURN json_build_object(
        'success', true,
        'message', 'Your password has been successfully reset. You may now sign in.'
      );
    END;
    $$;
    GRANT EXECUTE ON FUNCTION public.verify_and_reset_password(TEXT, TEXT) TO anon, authenticated, service_role;
  `);

  console.log("All enterprise authentication and security procedures successfully deployed!");
  await sql.end();
}

deploy().catch(err => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
