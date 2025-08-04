const AuthService = require("../auth/authService");

/**
 * JWT鉴权中间件
 * 验证请求头中的Authorization token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      code: 401,
      message: "访问令牌缺失",
    });
  }

  const user = AuthService.verifyAccessToken(token);
  if (!user) {
    return res.status(401).json({
      success: false,
      code: 401,
      message: "访问令牌无效或已过期",
    });
  }

  // 将用户信息添加到请求对象中
  req.user = user;
  next();
};

/**
 * 可选的JWT鉴权中间件
 * 如果有token则验证，没有token则继续执行
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    const user = AuthService.verifyAccessToken(token);
    if (user) {
      req.user = user;
    }
  }

  next();
};

/**
 * 管理员权限中间件
 * 需要先通过authenticateToken中间件
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      code: 401,
      message: "需要登录",
    });
  }

  // 这里可以根据实际需求检查用户角色
  // 假设用户表中有role字段或者通过其他方式判断管理员权限
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      code: 403,
      message: "需要管理员权限",
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
};