import postgres from 'postgres';

const connStr = 'postgres://postgres.becpnekqqkgjopjzemtt:Q6Dlial198lVgsQz@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require';
const sql = postgres(connStr, { ssl: 'require' });

async function deploy() {
  console.log("1. Adding schema extensions to queues, salons, and chairs...");

  await sql`
    ALTER TABLE queues 
      ADD COLUMN IF NOT EXISTS token_code TEXT,
      ADD COLUMN IF NOT EXISTS customer_name TEXT,
      ADD COLUMN IF NOT EXISTS customer_phone TEXT,
      ADD COLUMN IF NOT EXISTS service_name TEXT,
      ADD COLUMN IF NOT EXISTS barber_name TEXT,
      ADD COLUMN IF NOT EXISTS chair_assigned INTEGER,
      ADD COLUMN IF NOT EXISTS started_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
      ADD COLUMN IF NOT EXISTS join_type TEXT DEFAULT 'remote',
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
  `;

  await sql`
    UPDATE queues 
    SET token_code = '#' || LPAD(token_number::text, 3, '0'),
        customer_name = COALESCE(customer_name, 'Rohan Dash'),
        service_name = COALESCE(service_name, 'Signature Haircut & Style'),
        updated_at = NOW()
    WHERE token_code IS NULL;
  `;

  await sql`
    ALTER TABLE chairs
      ADD COLUMN IF NOT EXISTS current_customer TEXT;
  `;

  await sql`
    ALTER TABLE salons
      ADD COLUMN IF NOT EXISTS is_paused BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS waiting_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS wait_time INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS available_chairs INTEGER DEFAULT 3,
      ADD COLUMN IF NOT EXISTS total_chairs INTEGER DEFAULT 4,
      ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'intermediate';
  `;

  console.log("2. Creating join_queue_atomic RPC...");
  await sql`
    CREATE OR REPLACE FUNCTION public.join_queue_atomic(
      p_salon_id INTEGER,
      p_customer_id INTEGER DEFAULT NULL,
      p_customer_name TEXT DEFAULT 'Customer',
      p_customer_phone TEXT DEFAULT NULL,
      p_service_id INTEGER DEFAULT NULL,
      p_service_name TEXT DEFAULT 'Haircut & Styling',
      p_staff_id INTEGER DEFAULT NULL,
      p_barber_name TEXT DEFAULT NULL,
      p_join_type TEXT DEFAULT 'remote'
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_salon RECORD;
      v_existing RECORD;
      v_next_token INTEGER;
      v_token_code TEXT;
      v_waiting_ahead INTEGER;
      v_est_wait INTEGER;
      v_new_queue RECORD;
    BEGIN
      -- Check salon existence
      SELECT * INTO v_salon FROM salons WHERE id = p_salon_id;
      IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Salon not found');
      END IF;

      -- Check salon pause status
      IF v_salon.is_paused THEN
        RETURN json_build_object('success', false, 'message', 'This salon has currently paused queue entries.');
      END IF;

      -- Check duplicate active token for customer if identifier supplied
      IF p_customer_id IS NOT NULL THEN
        SELECT * INTO v_existing FROM queues 
        WHERE salon_id = p_salon_id 
          AND customer_id = p_customer_id 
          AND status IN ('waiting', 'called', 'in_service')
        ORDER BY id DESC LIMIT 1;

        IF FOUND THEN
          RETURN json_build_object(
            'success', true, 
            'already_active', true,
            'message', 'You already have an active token at this salon.',
            'queue', row_to_json(v_existing),
            'tokenCode', COALESCE(v_existing.token_code, '#' || v_existing.token_number),
            'tokenNumber', v_existing.token_number
          );
        END IF;
      END IF;

      -- Calculate next token number atomically
      SELECT COALESCE(MAX(token_number), 100) + 1 INTO v_next_token 
      FROM queues 
      WHERE salon_id = p_salon_id 
        AND created_at >= CURRENT_DATE;

      v_token_code := '#' || LPAD(v_next_token::text, 3, '0');

      -- Count waiting customers ahead
      SELECT COUNT(*) INTO v_waiting_ahead 
      FROM queues 
      WHERE salon_id = p_salon_id AND status = 'waiting';

      v_est_wait := (v_waiting_ahead + 1) * 12;

      -- Insert into queues
      INSERT INTO queues (
        salon_id, customer_id, customer_name, customer_phone,
        service_id, service_name, staff_id, barber_name,
        token_number, token_code, status, estimated_wait_mins,
        join_type, created_at, updated_at
      ) VALUES (
        p_salon_id, p_customer_id, p_customer_name, p_customer_phone,
        p_service_id, p_service_name, p_staff_id, p_barber_name,
        v_next_token, v_token_code, 'waiting', v_est_wait,
        p_join_type, NOW(), NOW()
      )
      RETURNING * INTO v_new_queue;

      -- Audit Event
      INSERT INTO queue_events (
        queue_id, salon_id, from_status, to_status, actor_role, note, created_at
      ) VALUES (
        v_new_queue.id, p_salon_id, 'none', 'waiting', 'customer', 
        'Token created via ' || p_join_type, NOW()
      );

      -- Update salon statistics
      UPDATE salons SET 
        waiting_count = v_waiting_ahead + 1,
        wait_time = v_est_wait
      WHERE id = p_salon_id;

      RETURN json_build_object(
        'success', true,
        'queue', row_to_json(v_new_queue),
        'tokenCode', v_token_code,
        'tokenNumber', v_next_token,
        'position', v_waiting_ahead + 1,
        'peopleAhead', v_waiting_ahead,
        'estimatedWaitMins', v_est_wait
      );
    END;
    $$;
  `;

  console.log("3. Creating advance_queue_atomic RPC...");
  await sql`
    CREATE OR REPLACE FUNCTION public.advance_queue_atomic(
      p_queue_id INTEGER,
      p_chair_number INTEGER DEFAULT 1,
      p_barber_name TEXT DEFAULT NULL,
      p_action TEXT DEFAULT 'call'
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_queue RECORD;
      v_target_status TEXT;
    BEGIN
      SELECT * INTO v_queue FROM queues WHERE id = p_queue_id;
      IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Queue entry not found');
      END IF;

      IF p_action = 'start' THEN
        v_target_status := 'in_service';
      ELSE
        v_target_status := 'called';
      END IF;

      UPDATE queues SET
        status = v_target_status,
        chair_assigned = p_chair_number,
        barber_name = COALESCE(p_barber_name, barber_name),
        called_at = CASE WHEN called_at IS NULL THEN NOW() ELSE called_at END,
        started_at = CASE WHEN p_action = 'start' THEN NOW() ELSE started_at END,
        updated_at = NOW()
      WHERE id = p_queue_id
      RETURNING * INTO v_queue;

      -- Update chair table
      UPDATE chairs SET
        status = 'occupied',
        current_customer = v_queue.customer_name,
        current_token = v_queue.token_code,
        current_service = v_queue.service_name,
        current_queue_id = p_queue_id,
        current_customer_id = v_queue.customer_id
      WHERE salon_id = v_queue.salon_id AND chair_number = p_chair_number;

      -- Log event
      INSERT INTO queue_events (
        queue_id, salon_id, from_status, to_status, actor_role, note, created_at
      ) VALUES (
        p_queue_id, v_queue.salon_id, 'waiting', v_target_status, 'staff',
        'Customer called to Chair ' || p_chair_number, NOW()
      );

      RETURN json_build_object(
        'success', true,
        'queue', row_to_json(v_queue)
      );
    END;
    $$;
  `;

  console.log("4. Creating complete_queue_atomic RPC...");
  await sql`
    CREATE OR REPLACE FUNCTION public.complete_queue_atomic(
      p_queue_id INTEGER,
      p_points_reward INTEGER DEFAULT 10
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_queue RECORD;
      v_waiting_remaining INTEGER;
    BEGIN
      SELECT * INTO v_queue FROM queues WHERE id = p_queue_id;
      IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Queue entry not found');
      END IF;

      UPDATE queues SET
        status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
      WHERE id = p_queue_id
      RETURNING * INTO v_queue;

      -- Free chair if assigned
      IF v_queue.chair_assigned IS NOT NULL THEN
        UPDATE chairs SET
          status = 'available',
          current_customer = NULL,
          current_token = NULL,
          current_service = NULL,
          current_queue_id = NULL,
          current_customer_id = NULL
        WHERE salon_id = v_queue.salon_id AND chair_number = v_queue.chair_assigned;
      END IF;

      -- Award loyalty points if registered customer
      IF v_queue.customer_id IS NOT NULL THEN
        INSERT INTO snepr_points_ledger (
          user_id, salon_id, queue_id, points, event_type, description, created_at
        ) VALUES (
          v_queue.customer_id, v_queue.salon_id, v_queue.id, p_points_reward, 'completed_visit',
          'Earned for completed service Token ' || COALESCE(v_queue.token_code, '#' || v_queue.token_number),
          NOW()
        );
      END IF;

      -- Log event
      INSERT INTO queue_events (
        queue_id, salon_id, from_status, to_status, actor_role, note, created_at
      ) VALUES (
        p_queue_id, v_queue.salon_id, v_queue.status, 'completed', 'staff',
        'Service completed and closed', NOW()
      );

      -- Recalculate waiting count
      SELECT COUNT(*) INTO v_waiting_remaining FROM queues WHERE salon_id = v_queue.salon_id AND status = 'waiting';
      UPDATE salons SET 
        waiting_count = v_waiting_remaining,
        wait_time = v_waiting_remaining * 12
      WHERE id = v_queue.salon_id;

      RETURN json_build_object(
        'success', true,
        'message', 'Service completed. Loyalty points awarded.',
        'queue', row_to_json(v_queue)
      );
    END;
    $$;
  `;

  console.log("5. Creating cancel_queue_atomic RPC...");
  await sql`
    CREATE OR REPLACE FUNCTION public.cancel_queue_atomic(
      p_queue_id INTEGER,
      p_reason TEXT DEFAULT 'Cancelled by user',
      p_actor_role TEXT DEFAULT 'customer'
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_queue RECORD;
      v_waiting_remaining INTEGER;
    BEGIN
      SELECT * INTO v_queue FROM queues WHERE id = p_queue_id;
      IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Queue entry not found');
      END IF;

      UPDATE queues SET
        status = 'cancelled',
        cancelled_at = NOW(),
        cancellation_reason = p_reason,
        updated_at = NOW()
      WHERE id = p_queue_id
      RETURNING * INTO v_queue;

      IF v_queue.chair_assigned IS NOT NULL THEN
        UPDATE chairs SET
          status = 'available',
          current_customer = NULL,
          current_token = NULL,
          current_service = NULL,
          current_queue_id = NULL,
          current_customer_id = NULL
        WHERE salon_id = v_queue.salon_id AND chair_number = v_queue.chair_assigned;
      END IF;

      INSERT INTO queue_events (
        queue_id, salon_id, from_status, to_status, actor_role, note, created_at
      ) VALUES (
        p_queue_id, v_queue.salon_id, v_queue.status, 'cancelled', p_actor_role,
        COALESCE(p_reason, 'Cancellation'), NOW()
      );

      SELECT COUNT(*) INTO v_waiting_remaining FROM queues WHERE salon_id = v_queue.salon_id AND status = 'waiting';
      UPDATE salons SET 
        waiting_count = v_waiting_remaining,
        wait_time = v_waiting_remaining * 12
      WHERE id = v_queue.salon_id;

      RETURN json_build_object('success', true, 'queue', row_to_json(v_queue));
    END;
    $$;
  `;

  console.log("6. Creating get_customer_token_details RPC...");
  await sql`
    CREATE OR REPLACE FUNCTION public.get_customer_token_details(
      p_token_identifier TEXT
    )
    RETURNS JSON
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, extensions, pg_temp
    AS $$
    DECLARE
      v_clean TEXT := TRIM(p_token_identifier);
      v_num INTEGER := NULL;
      v_queue RECORD;
      v_salon RECORD;
      v_people_ahead INTEGER := 0;
      v_position INTEGER := 1;
      v_est_wait INTEGER := 10;
      v_stage INTEGER := 2;
      v_is_stale BOOLEAN := FALSE;
    BEGIN
      -- Extract numeric portion if available
      IF v_clean ~ '^[0-9]+$' THEN
        v_num := v_clean::INTEGER;
      ELSIF v_clean ~ '[0-9]+' THEN
        v_num := substring(v_clean from '[0-9]+')::INTEGER;
      END IF;

      -- Look up by token_code, id, or token_number
      SELECT * INTO v_queue FROM queues
      WHERE token_code ILIKE v_clean 
         OR token_code ILIKE ('#' || v_clean)
         OR (v_num IS NOT NULL AND (id = v_num OR token_number = v_num))
      ORDER BY id DESC LIMIT 1;

      IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Token not found');
      END IF;

      -- Look up salon
      SELECT * INTO v_salon FROM salons WHERE id = v_queue.salon_id;

      -- Calculate stage: 1=joined, 2=waiting, 3=called, 4=in_service, 5=completed
      IF v_queue.status = 'called' THEN
        v_stage := 3;
      ELSIF v_queue.status = 'in_service' THEN
        v_stage := 4;
      ELSIF v_queue.status = 'completed' THEN
        v_stage := 5;
      ELSIF v_queue.status = 'cancelled' OR v_queue.status = 'no_show' THEN
        v_stage := 0;
      ELSE
        v_stage := 2;
      END IF;

      -- Calculate people ahead
      IF v_queue.status = 'waiting' THEN
        SELECT COUNT(*) INTO v_people_ahead FROM queues 
        WHERE salon_id = v_queue.salon_id 
          AND status = 'waiting' 
          AND (created_at < v_queue.created_at OR (created_at = v_queue.created_at AND id < v_queue.id));
        
        v_position := v_people_ahead + 1;
        v_est_wait := v_position * 12;
      ELSE
        v_people_ahead := 0;
        v_position := 0;
        v_est_wait := 0;
      END IF;

      -- Check stale queue: if not updated for > 15 mins
      IF EXTRACT(EPOCH FROM (NOW() - COALESCE(v_queue.updated_at, v_queue.created_at))) > 900 THEN
        v_is_stale := TRUE;
      END IF;

      RETURN json_build_object(
        'success', true,
        'queue', row_to_json(v_queue),
        'tokenCode', COALESCE(v_queue.token_code, '#' || v_queue.token_number),
        'tokenNumber', v_queue.token_number,
        'salonId', v_queue.salon_id,
        'salonName', COALESCE(v_salon.name, 'Snepr Partner Salon'),
        'address', COALESCE(v_salon.address, 'Bhubaneswar, Odisha'),
        'serviceName', COALESCE(v_queue.service_name, 'Signature Haircut'),
        'barberName', COALESCE(v_queue.barber_name, 'Stylist'),
        'chairAssigned', CASE WHEN v_queue.chair_assigned IS NOT NULL THEN 'Chair 0' || v_queue.chair_assigned ELSE 'Unassigned' END,
        'status', v_queue.status,
        'stage', v_stage,
        'position', v_position,
        'peopleAhead', v_people_ahead,
        'waitTimeMins', v_est_wait,
        'isStale', v_is_stale,
        'createdAt', v_queue.created_at,
        'updatedAt', COALESCE(v_queue.updated_at, v_queue.created_at)
      );
    END;
    $$;
  `;

  console.log("7. Granting execution permissions on all RPCs...");
  await sql`GRANT EXECUTE ON FUNCTION public.join_queue_atomic TO anon, authenticated, service_role`;
  await sql`GRANT EXECUTE ON FUNCTION public.advance_queue_atomic TO anon, authenticated, service_role`;
  await sql`GRANT EXECUTE ON FUNCTION public.complete_queue_atomic TO anon, authenticated, service_role`;
  await sql`GRANT EXECUTE ON FUNCTION public.cancel_queue_atomic TO anon, authenticated, service_role`;
  await sql`GRANT EXECUTE ON FUNCTION public.get_customer_token_details TO anon, authenticated, service_role`;

  console.log("QUEUE ENGINE DEPLOYED AND GRANTED CLEANLY!");
  await sql.end();
}

deploy();
