const bcrypt = require("bcrypt");
const authService = require("../service/auth.service");
const { generateToken } = require("../utils/jwt.utils");

const pick = (obj, ...keys) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return undefined;
};

function httpStatusFromResult(result, { successCode = 200 } = {}) {
  if (!result) return 500;

  const status = String(pick(result, "status", "p_status") || "").toLowerCase();
  if (status === "success") return successCode;

  const msg = String(pick(result, "message", "p_message") || "").toLowerCase();
  if (msg.includes("already") || msg.includes("exists")) return 409;
  if (msg.includes("invalid") || msg.includes("unauthorized")) return 401;
  if (msg.includes("locked") || msg.includes("inactive") || msg.includes("forbidden")) return 403;

  return 400;
}

function apiResponse(result, dataOverride = undefined) {
  return {
    status: pick(result, "status", "p_status") || "Error",
    message: pick(result, "message", "p_message") || "Request failed",
    data:
      dataOverride !== undefined
        ? dataOverride
        : pick(result, "user_data", "p_user_data", "data") ?? null,
  };
}

// POST /api/auth/signup
async function signup(req, res, next) {
  try {
    const result = await authService.signupWithPassword(req.body);

    const code = httpStatusFromResult(result, { successCode: 201 });
    if (code >= 400) return res.status(code).json(apiResponse(result, null));

    return res.status(201).json({
      status: "Success",
      message: pick(result, "message", "p_message"),
      data: {
        user_id: pick(result, "user_id", "p_user_id"),
        account_number: pick(result, "account_number", "p_account_number"),
        email: req.body.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/signup/sso
async function signupSSO(req, res, next) {
  try {
    const result = await authService.signupWithSSO(req.body);

    const isNew = !!pick(result, "is_new_user", "p_is_new_user");
    const code = httpStatusFromResult(result, { successCode: isNew ? 201 : 200 });
    if (code >= 400) return res.status(code).json(apiResponse(result, null));

    return res.status(code).json({
      status: "Success",
      message: pick(result, "message", "p_message"),
      data: {
        user_id: pick(result, "user_id", "p_user_id"),
        is_new_user: isNew,
        email: req.body.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login - NEW 3-STEP PROCESS WITH JWT
async function login(req, res, next) {
  try {
    const { account_number, password } = req.body;
    const ip_address = req.ip || req.connection?.remoteAddress || null;
    const user_agent = req.headers["user-agent"] || null;

    // Get user data with password hash
    const step1Result = await authService.loginWithPassword({
      account_number,
      ip_address,
    });

    const p_user_id = pick(step1Result, "user_id", "p_user_id");
    const p_status = pick(step1Result, "status", "p_status");
    const p_message = pick(step1Result, "message", "p_message");
    const p_user_data = pick(step1Result, "user_data", "p_user_data");

    // Check if step 1 failed (account not found, locked, inactive, etc.)
    if (p_status !== "Success") {
      const code = httpStatusFromResult(step1Result, { successCode: 200 });
      return res.status(code).json({
        status: p_status,
        message: p_message,
        data: null,
      });
    }

    // Verify password using bcrypt
    const password_hash = p_user_data?.password_hash;

    if (!password_hash) {
      return res.status(500).json({
        status: "Error",
        message: "Password hash not found",
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, password_hash);

    if (isPasswordValid) {
      // Password matches - record success
      const successResult = await authService.loginSuccess({
        user_id: p_user_id,
        ip_address,
        user_agent,
      });

      const finalUserData = pick(successResult, "user_data", "p_user_data");
      const successMessage = pick(successResult, "message", "p_message");

      // Generate JWT Token
      const token = generateToken({
        user_id: finalUserData.user_id,
        email: finalUserData.email,
        account_number: finalUserData.account_number,
        auth_method: finalUserData.auth_method || "Password",
      });

      return res.status(200).json({
        status: "Success",
        message: successMessage || "Login successful",
        data: finalUserData,
        token: token,
      });
    } else {
      // Password doesn't match - record failure
      const failResult = await authService.loginFailed({
        user_id: p_user_id,
        ip_address,
      });

      const failStatus = pick(failResult, "status", "p_status");
      const failMessage = pick(failResult, "message", "p_message");
      const isLocked = pick(failResult, "is_locked", "p_is_locked");
      const lockedUntil = pick(failResult, "locked_until", "p_locked_until");

      return res.status(401).json({
        status: failStatus || "Failed",
        message: failMessage || "Invalid password",
        data: {
          is_locked: isLocked,
          locked_until: lockedUntil,
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login/sso
async function loginSSO(req, res, next) {
  try {
    const result = await authService.loginWithSSO(req.body);

    const isNew = !!pick(result, "is_new_user", "p_is_new_user");
    const successCode = isNew ? 201 : 200;

    const code = httpStatusFromResult(result, { successCode });
    if (code >= 400) return res.status(code).json(apiResponse(result, null));

    const userData = pick(result, "user_data", "p_user_data");

    // Generate JWT Token for SSO login
    const token = generateToken({
      user_id: userData.user_id,
      email: userData.email,
      account_number: userData.account_number,
      auth_method: userData.auth_method || "SSO",
    });

    return res.status(successCode).json({
      status: "Success",
      message: pick(result, "message", "p_message"),
      data: userData,
      is_new_user: isNew,
      token: token, 
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/add-password
async function addPassword(req, res, next) {
  try {
    const result = await authService.addPassword(req.body);

    const code = httpStatusFromResult(result, { successCode: 200 });
    if (code >= 400) return res.status(code).json(apiResponse(result, null));

    return res.status(200).json({
      status: "Success",
      message: pick(result, "message", "p_message"),
      data: { account_number: pick(result, "account_number", "p_account_number") },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res, next) {
  try {
    // We still call procedure, but do not leak existence of email
    await authService.forgotPassword(req.body);

    return res.status(200).json({
      status: "Success",
      message: "If email is registered, you will receive reset instructions",
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password
async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body);

    const code = httpStatusFromResult(result, { successCode: 200 });
    if (code >= 400) return res.status(code).json(apiResponse(result, null));

    return res.status(200).json({
      status: "Success",
      message: pick(result, "message", "p_message"),
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/auth/change-password
async function changePassword(req, res, next) {
  try {
    const user_id = req.user?.user_id ?? req.body.user_id;

    const result = await authService.changePassword({
      user_id,
      current_password: req.body.current_password,
      new_password: req.body.new_password,
    });

    const code = httpStatusFromResult(result, { successCode: 200 });
    if (code >= 400) return res.status(code).json(apiResponse(result, null));

    return res.status(200).json({
      status: "Success",
      message: pick(result, "message", "p_message"),
      data: null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  signup,
  signupSSO,
  login,
  loginSSO,
  addPassword,
  forgotPassword,
  resetPassword,
  changePassword,
};