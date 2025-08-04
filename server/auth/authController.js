const AuthService = require("./authService");
const { db } = require("../db");

class AuthController {
  /**
   * 发送邮箱验证码（需要图形验证码）
   */
  static async sendEmailCode(req, res) {
    try {
      const { email, captchaId, captchaCode, type = "register" } = req.body;

      if (!email || !captchaId || !captchaCode) {
        return res.status(400).json({
          success: false,
          message: "邮箱地址、图形验证码不能为空",
          code: 400,
        });
      }

      const result = await AuthService.sendEmailVerificationCode(
        email,
        captchaId,
        captchaCode,
        type,
      );

      res.json({
        success: true,
        code: 200,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        code: 400,
        message: error,
      });
    }
  }

  /**
   * 验证邮箱验证码
   */
  static async verifyEmailCode(req, res) {
    try {
      const { email, code, type = "register" } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: "邮箱和验证码不能为空",
        });
      }

      const result = await AuthService.verifyEmailCode(email, code, type);

      res.json({
        success: true,
        code: 200,
        message: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        code: 400,
        message: error,
      });
    }
  }

  /**
   * 用户注册（只需要邮箱验证码）
   */
  static async register(req, res) {
    try {
      const { username, password, email, emailCode } = req.body;

      // 参数验证
      if (!username || !password || !email || !emailCode) {
        return res.status(400).json({
          success: false,
          message: "用户名、密码、邮箱和邮箱验证码都是必填的",
        });
      }

      // 注册用户（包含邮箱验证码验证）
      const result = await AuthService.registerWithEmailVerification(
        username,
        password,
        email,
        emailCode,
      );
      if (req.body.login) {
        const user = await db("ba_blog_user")
          .select("id", "name", "email", "phone")
          .where("id", result.userId)
          .first();
        const tokens = AuthService.generateTokens(user);
        res.json({
          success: true,
          code: 200,
          message: "登录成功",
          data: {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            ...tokens,
          },
        });
        return;
      }

      res.json({
        success: true,
        code: 200,
        message: result.message,
        data: {
          userId: result.userId,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        code: 400,
        message: error,
      });
    }
  }

  /**
   * 用户登录
   */
  static async login(req, res) {
    try {
      const { email, password, captchaCode, captchaId } = req.body;

      // 参数验证
      if (!email || !password || !captchaCode || !captchaId) {
        return res.status(400).json({
          success: false,
          message: "所有字段都是必填的",
        });
      }

      // 验证图形验证码
      const captchaValid = await AuthService.verifyCaptcha(
        captchaId,
        captchaCode,
      );
      if (!captchaValid) {
        return res.status(200).json({
          success: false,
          message: "图形验证码错误或已过期",
          code: 400,
        });
      }

      // 验证用户密码
      try {
        const success = await AuthService.verifyPassword(email, password);
        if (!success)
          return res.status(200).json({
            success: false,
            message: "账号或密码错误",
            code: 400,
          });
      } catch (error) {
        return res.status(200).json({
          success: false,
          message: error,
          code: 400,
        });
      }

      // 获取用户信息
      const user = await db("ba_blog_user")
        .select("id", "name", "email", "phone")
        .where("email", email)
        .first();

      if (!user) {
        return res.status(200).json({
          success: false,
          message: "用户不存在",
          code: 404,
        });
      }

      // 生成token
      const tokens = AuthService.generateTokens(user);

      res.json({
        success: true,
        code: 200,
        message: "登录成功",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          ...tokens,
        },
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        code: 400,
        message: error.message,
      });
    }
  }
  static async getCaptcha(req, res) {
    try {
      const result = AuthService.generateSvgCaptcha();
      res.json({
        id: result.id,
        captcha: btoa(result.data),
      });
    } catch (error) {
      console.error("生成验证码失败:", error);
      res.status(500).json({
        success: false,
        message: "生成验证码失败",
      });
    }
  }
  static async verifyCaptcha(req, res) {
    try {
      const { id, code } = req.query;
      const result = await AuthService.verifyCaptcha(id, code);
      res.json({
        success: result,
        message: result ? "验证码正确" : "验证码错误或已过期",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "验证失败",
      });
    }
  }
  static async refreshToken(refreshToken, res) {
    try {
      const result = await AuthService.refreshToken(refreshToken);
      res.json({
        success: true,
        code: 200,
        message: "刷新成功",
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error,
        code: 401,
      });
    }
  }

  /**
   * 用户登出
   */
  static async logout(req, res) {
    try {
      const authHeader = req.headers["authorization"];
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          code: 400,
          message: "refreshToken不能为空",
        });
      }

      // 将refreshToken加入黑名单（从Redis中删除）
      await AuthService.logout(refreshToken);

      res.json({
        success: true,
        code: 200,
        message: "登出成功",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        code: 400,
        message: error.message || error,
      });
    }
  }

  /**
   * 获取当前用户信息
   */
  static async getUserInfo(req, res) {
    try {
      // 从中间件中获取用户信息
      const userId = req.user.id;

      const userInfo = await AuthService.getUserInfo(userId);

      res.json({
        success: true,
        code: 200,
        message: "获取用户信息成功",
        data: userInfo,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        code: 400,
        message: error.message || error,
      });
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUserInfo(req, res) {
    try {
      const userId = req.user.id;
      const { name, phone } = req.body;

      const result = await AuthService.updateUserInfo(userId, { name, phone });

      res.json({
        success: true,
        code: 200,
        message: "更新用户信息成功",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        code: 400,
        message: error.message || error,
      });
    }
  }
}

module.exports = AuthController;
