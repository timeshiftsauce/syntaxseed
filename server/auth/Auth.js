const express = require("express");
const router = express.Router();
const AuthController = require("./authController.js");
const { authenticateToken } = require("../middleware/authMiddleware.js");

// 获取图形验证码
router.get("/captcha", AuthController.getCaptcha);

// 验证图形验证码（测试用）
router.get("/verify-captcha", AuthController.verifyCaptcha);

// 发送邮箱验证码
router.post("/send-email-code", AuthController.sendEmailCode);

// 验证邮箱验证码
router.post("/verify-email-code", AuthController.verifyEmailCode);

// 用户注册
router.post("/register", AuthController.register);

// 用户登录
router.post("/login", AuthController.login);

// 刷新token
router.post("/refresh-token", async (req, res) => {
    const auth = req.headers.authorization.split(" ")[1];
    console.log(req.headers.authorization.split(' ')[1]);
    await AuthController.refreshToken(auth, res);
});

// 用户登出
router.post("/logout", AuthController.logout);

// 获取用户信息（需要认证）
router.get("/user-info", authenticateToken, AuthController.getUserInfo);

// 更新用户信息（需要认证）
router.put("/user-info", authenticateToken, AuthController.updateUserInfo);

// 测试邮件服务连接
router.get("/test-email", async (req, res) => {
    try {
        const emailService = require("../services/emailService");
        const isConnected = await emailService.testConnection();

        res.json({
            success: isConnected,
            message: isConnected ? "邮件服务连接正常" : "邮件服务连接失败",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "测试邮件服务失败",
            error: error.message,
        });
    }
});

module.exports = router;
