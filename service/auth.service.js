const db = require("../config/db");
const bcrypt = require("bcrypt");

// CALL a Postgres PROCEDURE and return OUT params row (first row)
async function callProcCall(sql, params) {
  const result = await db.query(sql, params);
  return result?.rows?.[0] ?? null;
}

// Signup with password -> PROCEDURE sp_signup_with_password
async function signupWithPassword(payload) {
  const {
    first_name,
    last_name,
    mobile_number,
    email,
    company_name = null,
    industry_type = null,
    password,
  } = payload;

  // Hashing password before sending to database
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const sql = `
    CALL public.sp_signup_with_password(
      $1::varchar, $2::varchar, $3::varchar, $4::varchar,
      $5::varchar, $6::varchar, $7::varchar,
      NULL, NULL, NULL, NULL
    )
  `;

  return callProcCall(sql, [
    first_name,
    last_name,
    mobile_number,
    email,
    company_name,
    industry_type,
    password_hash,
  ]);
}

// Signup with SSO -> PROCEDURE sp_signup_with_sso
async function signupWithSSO(payload) {
  const {
    sso_provider,
    sso_user_id,
    email,
    first_name = null,
    last_name = null,
    mobile_number = null,
    company_name = null,
    industry_type = null,
  } = payload;

  const sql = `
    CALL public.sp_signup_with_sso(
      NULL, NULL, NULL, NULL,
      $1::varchar, $2::varchar, $3::varchar,
      $4::varchar, $5::varchar, $6::varchar,
      $7::varchar, $8::varchar
    )
  `;

  return callProcCall(sql, [
    sso_provider,
    sso_user_id,
    email,
    first_name,
    last_name,
    mobile_number,
    company_name,
    industry_type,
  ]);
}

// Login with password - Get user data with password hash
async function loginWithPassword(payload) {
  const { account_number, ip_address = null } = payload;

  const sql = `
    CALL public.sp_login_with_password(
      NULL, NULL, NULL, NULL,
      $1::varchar, $2::varchar
    )
  `;

  return callProcCall(sql, [account_number, ip_address]);
}

// Login success - Record successful login after password verification
async function loginSuccess(payload) {
  const { user_id, ip_address = null, user_agent = null } = payload;

  const sql = `
    CALL public.sp_login_success(
      NULL, NULL, NULL,
      $1::int, $2::varchar, $3::varchar
    )
  `;

  return callProcCall(sql, [user_id, ip_address, user_agent]);
}

// Login failed - Record failed login attempt
async function loginFailed(payload) {
  const { user_id, ip_address = null } = payload;

  const sql = `
    CALL public.sp_login_failed(
      NULL, NULL, NULL, NULL,
      $1::int, $2::varchar
    )
  `;

  return callProcCall(sql, [user_id, ip_address]);
}

// Login with SSO -> PROCEDURE sp_login_with_sso
async function loginWithSSO(payload) {
  const {
    sso_provider,
    sso_user_id,
    email,
    first_name = null,
    last_name = null,
    ip_address = null,
  } = payload;

  const sql = `
    CALL public.sp_login_with_sso(
      NULL, NULL, NULL, NULL, NULL,
      $1::varchar, $2::varchar, $3::varchar,
      $4::varchar, $5::varchar, $6::varchar
    )
  `;

  return callProcCall(sql, [
    sso_provider,
    sso_user_id,
    email,
    first_name,
    last_name,
    ip_address,
  ]);
}

// Add password to SSO user -> PROCEDURE sp_add_password_to_sso_user
async function addPassword(payload) {
  const { user_id, password, mobile_number = null } = payload;

  // Hash password before sending to database
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  const sql = `
    CALL public.sp_add_password_to_sso_user(
      NULL, NULL, NULL,
      $1::int, $2::varchar, $3::varchar
    )
  `;

  return callProcCall(sql, [user_id, password_hash, mobile_number]);
}

// Forgot password -> PROCEDURE sp_request_password_reset
async function forgotPassword(payload) {
  const { email } = payload;

  const sql = `
    CALL public.sp_request_password_reset(
      $1::varchar, NULL, NULL, NULL
    )
  `;

  return callProcCall(sql, [email]);
}

// Reset password -> PROCEDURE sp_reset_password
async function resetPassword(payload) {
  const { token, new_password } = payload;

  //Hashing password before sending to database
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(new_password, saltRounds);

  const sql = `
    CALL public.sp_reset_password(
      $1::varchar, $2::varchar, NULL, NULL
    )
  `;

  return callProcCall(sql, [token, password_hash]);
}

// Change password -> PROCEDURE sp_change_password
async function changePassword(payload) {
  const { user_id, current_password, new_password } = payload;

  // Hash new password before sending to database
  const saltRounds = 10;
  const new_password_hash = await bcrypt.hash(new_password, saltRounds);

  const sql = `
    CALL public.sp_change_password(
      $1::int, $2::varchar, $3::varchar, NULL, NULL
    )
  `;

  return callProcCall(sql, [user_id, current_password, new_password_hash]);
}

module.exports = {
  signupWithPassword,
  signupWithSSO,
  loginWithPassword,
  loginSuccess,
  loginFailed,
  loginWithSSO,
  addPassword,
  forgotPassword,
  resetPassword,
  changePassword,
};