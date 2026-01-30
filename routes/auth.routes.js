const express = require("express");
const controller = require("../controllers/auth.controller");

const router = express.Router();
router.post("/signup", controller.signup);
router.post("/signup/sso", controller.signupSSO);

router.post("/login", controller.login);
router.post("/login/sso", controller.loginSSO);

router.post("/add-password", controller.addPassword);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

// Protected route (JWT middleware should set req.user)
// router.put("/change-password", authMiddleware, controller.changePassword);
router.put("/change-password", controller.changePassword);

module.exports = router;
