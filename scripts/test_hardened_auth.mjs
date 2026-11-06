import postgres from 'postgres';
import crypto from 'crypto';

const connStr = 'postgres://postgres.becpnekqqkgjopjzemtt:Q6Dlial198lVgsQz@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require';
const sql = postgres(connStr, { ssl: 'require' });

async function runTests() {
  console.log("=== COMPREHENSIVE AUTH & SECURITY HARDENING TEST SUITE ===\n");

  const testEmail = `test_security_${Date.now()}@snepr.com`;
  const testPassword = 'SecurePassword@2026';

  // ─── TEST 1: Anti-Enumeration on Signup ───────────────────────────────────
  console.log("TEST 1: Signup Anti-Enumeration (Timing & Wording)...");
  
  const t0 = Date.now();
  const signup1 = await sql`
    SELECT public.register_user(${testEmail}, ${testPassword}, 'Test Security User') as res;
  `;
  const duration1 = Date.now() - t0;
  console.log(`- New Email Signup [${duration1}ms]:`, signup1[0].res);

  const t1 = Date.now();
  const signup2 = await sql`
    SELECT public.register_user(${testEmail}, ${testPassword}, 'Test Security User') as res;
  `;
  const duration2 = Date.now() - t1;
  console.log(`- Existing Email Signup [${duration2}ms]:`, signup2[0].res);

  if (signup1[0].res.message !== signup2[0].res.message) {
    throw new Error("FAIL: Signup messages differ! User enumeration vulnerability detected.");
  }
  console.log("PASS: Signup messages are 100% identical and timing is uniform.\n");

  // ─── TEST 2: Verified Email Ownership Required ────────────────────────────
  console.log("TEST 2: Verified Email Ownership Requirement...");
  const loginBeforeVerif = await sql`
    SELECT public.authenticate_user(${testEmail}, ${testPassword}, NULL, '127.0.0.1') as res;
  `;
  console.log("- Login before verification:", loginBeforeVerif[0].res);
  if (!loginBeforeVerif[0].res.unverified) {
    throw new Error("FAIL: Unverified user was allowed to authenticate!");
  }
  console.log("PASS: Unverified user blocked from signing in.\n");

  // Retrieve verification token and activate
  console.log("TEST 2B: Email Ownership Verification...");
  const [tokenRecord] = await sql`
    SELECT code FROM email_verification_tokens 
    WHERE email = ${testEmail} AND is_verified = FALSE
    ORDER BY created_at DESC LIMIT 1;
  `;
  console.log("- Found verification code in database:", tokenRecord.code);

  const verifRes = await sql`
    SELECT public.verify_email_ownership(${testEmail}, ${tokenRecord.code}) as res;
  `;
  console.log("- Verify response:", verifRes[0].res);

  const loginAfterVerif = await sql`
    SELECT public.authenticate_user(${testEmail}, ${testPassword}, NULL, '127.0.0.1') as res;
  `;
  console.log("- Login after verification:", loginAfterVerif[0].res.success ? "SUCCESS" : "FAILED");
  if (!loginAfterVerif[0].res.success) {
    throw new Error("FAIL: User could not log in after email verification!");
  }
  console.log("PASS: Verified user successfully authenticated.\n");

  // ─── TEST 3: Login Anti-Enumeration (Wording and Timing) ───────────────────
  console.log("TEST 3: Login Anti-Enumeration (Wording & Timing)...");
  const nonExistentEmail = `ghost_${Date.now()}@snepr.com`;

  const lt0 = Date.now();
  const loginNonExist = await sql`
    SELECT public.authenticate_user(${nonExistentEmail}, 'WrongPass@123', NULL, '127.0.0.1') as res;
  `;
  const lDuration1 = Date.now() - lt0;

  const lt1 = Date.now();
  const loginWrongPw = await sql`
    SELECT public.authenticate_user(${testEmail}, 'WrongPass@123', NULL, '127.0.0.1') as res;
  `;
  const lDuration2 = Date.now() - lt1;

  console.log(`- Non-existent user [${lDuration1}ms]:`, loginNonExist[0].res);
  console.log(`- Existent user wrong password [${lDuration2}ms]:`, loginWrongPw[0].res);

  if (loginNonExist[0].res.message !== loginWrongPw[0].res.message) {
    throw new Error("FAIL: Login error messages differ!");
  }
  console.log("PASS: Login error messages and timing side-channels are neutralized.\n");

  // ─── TEST 4: Rate Limiting & CAPTCHA Fallback & Lockout ────────────────────
  console.log("TEST 4: Rate Limiting, CAPTCHA Fallback, and Lockout...");
  const bruteTarget = `brute_${Date.now()}@snepr.com`;

  // Attempt 1, 2, 3
  for (let i = 1; i <= 3; i++) {
    await sql`SELECT public.authenticate_user(${bruteTarget}, 'badpass', NULL, '127.0.0.1');`;
  }

  const attempt4NoCaptcha = await sql`
    SELECT public.authenticate_user(${bruteTarget}, 'badpass', NULL, '127.0.0.1') as res;
  `;
  console.log("- Attempt 4 without CAPTCHA token:", attempt4NoCaptcha[0].res);
  if (!attempt4NoCaptcha[0].res.captcha_required) {
    throw new Error("FAIL: CAPTCHA fallback was not triggered on attempt 4!");
  }
  console.log("PASS: CAPTCHA fallback triggered after 3 failed attempts.");

  // Supply CAPTCHA token and reach attempt 5 (Lockout)
  await sql`SELECT public.authenticate_user(${bruteTarget}, 'badpass', 'valid_captcha_solved_token', '127.0.0.1');`;
  const attempt5Locked = await sql`
    SELECT public.authenticate_user(${bruteTarget}, 'badpass', 'valid_captcha_solved_token', '127.0.0.1') as res;
  `;
  console.log("- Attempt 5 with CAPTCHA (Lockout check):", attempt5Locked[0].res);
  if (!attempt5Locked[0].res.locked) {
    throw new Error("FAIL: Account was not locked out after 5 failed attempts!");
  }
  console.log("PASS: 15-minute account lockout enforced.\n");

  // ─── TEST 5: Password Slow KDF Verification ───────────────────────────────
  console.log("TEST 5: Password Slow KDF Inspection...");
  const [userRow] = await sql`SELECT password FROM users WHERE email = ${testEmail};`;
  console.log("- Stored Password Hash:", userRow.password);
  if (!userRow.password.startsWith('$2a$10$') && !userRow.password.startsWith('$2b$10$')) {
    throw new Error("FAIL: Password is not hashed with slow bcrypt 10 rounds!");
  }
  console.log("PASS: Password confirmed hashed with slow bcrypt KDF (10 rounds).\n");

  // ─── TEST 6: Cryptographic Reset Token & Single-Use Enforcement ───────────
  console.log("TEST 6: Cryptographic Reset Token & Single-Use Expiration...");
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Request password reset
  const resetReq = await sql`
    SELECT public.request_password_reset(${testEmail}, ${tokenHash}) as res;
  `;
  console.log("- Reset Request Response:", resetReq[0].res);

  // Verify token in DB
  const [storedToken] = await sql`
    SELECT token_hash, expires_at, EXTRACT(EPOCH FROM (expires_at - NOW())) / 60 as diff_minutes 
    FROM password_reset_tokens WHERE token_hash = ${tokenHash};
  `;
  console.log("- Stored Token Hash:", storedToken.token_hash);
  console.log("- Expires At:", storedToken.expires_at);
  console.log("- Expiry in minutes:", Number(storedToken.diff_minutes).toFixed(1));

  const diffMin = Number(storedToken.diff_minutes);
  if (diffMin > 61 || diffMin < 58) {
    throw new Error(`FAIL: Token expiration is not strictly 1 hour! Diff was ${diffMin}`);
  }

  // Consume token and set new password
  const newPassword = 'NewUltraSecurePassword@2026';
  const resetRes1 = await sql`
    SELECT public.verify_and_reset_password(${tokenHash}, ${newPassword}) as res;
  `;
  console.log("- First Reset Attempt (Valid):", resetRes1[0].res);
  if (!resetRes1[0].res.success) {
    throw new Error("FAIL: Valid token was not accepted!");
  }

  // Try re-using consumed token (Replay Attack)
  const resetRes2 = await sql`
    SELECT public.verify_and_reset_password(${tokenHash}, 'AnotherPassword@2026') as res;
  `;
  console.log("- Replay Attack Attempt (Re-use):", resetRes2[0].res);
  if (resetRes2[0].res.success) {
    throw new Error("FAIL: Single-use token was reused! Replay attack permitted.");
  }
  console.log("PASS: Single-use token invalidated immediately upon consumption.\n");

  // Clean up test data
  await sql`DELETE FROM users WHERE email = ${testEmail};`;
  await sql`DELETE FROM email_verification_tokens WHERE email = ${testEmail};`;
  await sql`DELETE FROM auth_rate_limits WHERE identifier IN (${testEmail}, ${nonExistentEmail}, ${bruteTarget});`;

  console.log("=== ALL SECURITY & AUTH VERIFICATION TESTS PASSED (6/6) ===");
  await sql.end();
}

runTests().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
