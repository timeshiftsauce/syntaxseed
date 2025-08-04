const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { config } = require("../config/env");
const { db, redis } = require("../db");
const _ = require("lodash");
const svgCaptcha = require("svg-captcha");
const emailServer = require("../services/emailService")

class AuthService {
    static validatePassword(pass) {
        const regex = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,16}$/;
        return regex.test(pass);
    }
    static validateEmail(email) {
        const regex =
            /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/;
        return regex.test(email);
    }
    static generateTokens({ id, name, email, phone }) {
        const accessToken = jwt.sign(
            {
                id,
                name,
                email,
                phone: phone ?? null
            },
            config.jwt.access.secret,
            { expiresIn: config.jwt.access.expiresIn },
        );

        const refreshToken = jwt.sign({ id }, config.jwt.refresh.secret, {
            expiresIn: config.jwt.refresh.expiresIn,
        });
        redis.set(
            config.redis.head + refreshToken,
            refreshToken,
            "EX",
            config.jwt.refresh.expiresIn,
        );
        return { accessToken, refreshToken };
    }
    static refreshToken(refreshToken) {
        return new Promise(async (resolve, reject) => {
            if (!refreshToken) {
                reject("refreshToken不能为空");
                return;
            }

            const user = this.verifyRefreshToken(refreshToken);
            if (!user) {
                reject("refreshToken无效或已过期");
                return;
            }
            if (!await redis.get(config.redis.head + refreshToken)) {
                reject("refreshToken已过期")
            }
            try {
                redis.del(config.redis.head + refreshToken);
            } catch (error) { }
            const userdata = await db("ba_blog_user")
                .select("id", "name", "email", "phone")
                .where("id", user.id)
                .first();
            if (!userdata) {
                reject("refreshToken无效");
                return;
            }
            const tokens = this.generateTokens(userdata);
            resolve(tokens);
        });
    }
    static generateSvgCaptcha() {
        const { data, text } = svgCaptcha.create({
            size: 5,
            noise: 2,
            color: true,
            background: "#f5f5f5",
            ignoreChars: '0o1i'
        });
        const hash = bcrypt.hashSync(text.toLocaleLowerCase(), 4);
        redis.set(hash, text.toLocaleLowerCase(), "EX", 60 * 2);
        return {
            data,
            id: hash,
        };
    }
    // 验证密码
    static verifyPassword(email, password) {
        password = _.trim(password);
        email = _.trim(email);
        return new Promise(async (resolve, reject) => {
            if (!email || !password) {
                reject("邮箱或密码不能为空");
                return;
            }
            if (!this.validateEmail(email)) {
                reject("请输入正确的邮箱");
                return;
            }

            const userPass = await db("ba_blog_user")
                .select("password")
                .where("email", email)
                .first();
            if (!userPass?.password) {
                reject("用户不存在");
            }
            const isSuccess = await bcrypt.compare(password, userPass.password);
            resolve(isSuccess);
        });
    }
    static async verifyCaptcha(id, text) {
        const effective = await redis.get(id);
        if (!effective) {
            return false;
        }
        redis.del(id);
        return await bcrypt.compare(text.toLocaleLowerCase(), id);
    }
    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, config.jwt.access.secret);
        } catch (error) {
            return undefined;
        }
    }
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, config.jwt.refresh.secret);
        } catch (error) {
            return null;
        }
    }

    /**
     * 生成6位数字验证码
     */
    static generateEmailCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * 发送邮箱验证码（需要先验证图形验证码）
     * @param {string} email - 邮箱地址
     * @param {string} captchaId - 图形验证码ID
     * @param {string} captchaCode - 图形验证码
     * @param {string} type - 验证码类型 (register/reset)
     */
    static async sendEmailVerificationCode(
        email,
        captchaId,
        captchaCode,
        type = "register",
    ) {
        return new Promise(async (resovle, reject) => {
            try {
                // 验证图形验证码
                const captchaValid = await this.verifyCaptcha(captchaId, captchaCode);
                if (!captchaValid) {
                    throw new Error("图形验证码错误或已过期");
                }
                const hasEmail = await db("ba_blog_user")
                    .select("id")
                    .where("email", email)
                    .limit(1)
                    .first();
                if (hasEmail) {
                    reject("邮箱已存在");
                    return;
                }
                const code = this.generateEmailCode()
                await emailServer.sendVerificationCode(email, code)
                const codeKey = `email_verification_code:${type}:${email}`;
                await redis.set(codeKey, code);
                resovle("验证码已发送到您的邮箱，请查收");
            } catch (error) {
                reject(error.message);
            }
        });
    }

    /**
     * 验证邮箱验证码
     * @param {string} email - 邮箱地址
     * @param {string} code - 验证码
     * @param {string} type - 验证码类型 (register/reset)
     */
    static async verifyEmailCode(email, code, type = "register") {
        return new Promise(async (resovle, reject) => {
            try {
                if (!email || !code) {
                    reject("邮箱和验证码不能为空");
                    return;
                }

                // 从Redis获取验证码
                const codeKey = `email_verification_code:${type}:${email}`;
                const storedCode = await redis.get(codeKey);

                if (!storedCode) {
                    reject("验证码已过期或不存在");
                    return;
                }

                if (storedCode !== code.trim()) {
                    reject("验证码错误");
                    return;
                }

                // 验证成功后删除验证码
                await redis.del(codeKey);

                resovle("验证码验证成功");
            } catch (error) {
                reject(error.message);
            }
        });
    }

    /**
     * 注册用户（需要邮箱验证码）
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @param {string} email - 邮箱
     * @param {string} emailCode - 邮箱验证码
     */
    static async registerWithEmailVerification(
        username,
        password,
        email,
        emailCode,
    ) {
        password = password.trim();
        username = username.trim();
        email = email.trim();
        return new Promise(async (resolve, reject) => {
            // 基础验证
            if (!this.validatePassword(password)) {
                reject("密码必须包含数字，字母或特殊符号且长度在8-16位");
                return;
            }

            if (!this.validateEmail(email)) {
                reject("请输入正确的邮箱");
                return;
            }

            if (username.length < 3 || username.length > 12) {
                reject("用户名长度一般在3-12位");
                return;
            }

            // 验证邮箱验证码
            try {
                await this.verifyEmailCode(email, emailCode, "register");
            } catch (error) {
                reject(error);
                return;
            }

            // 检查邮箱是否已存在
            const hasEmail = await db("ba_blog_user")
                .select("id")
                .where("email", email)
                .limit(1)
                .first();

            if (hasEmail) {
                reject("邮箱已存在");
                return;
            }

            // 创建用户
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = {
                status: 1,
                name: username,
                password: hashedPassword,
                email,
                regist_time: Math.floor(Date.now() / 1000),
            };

            const [userId] = await db("ba_blog_user").insert(user);

            return resolve({
                success: true,
                message: "注册成功",
                userId,
            });
        });
    }

    /**
     * 用户登出
     * @param {string} refreshToken - 刷新令牌
     */
    static async logout(refreshToken) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!refreshToken) {
                    reject("refreshToken不能为空");
                    return;
                }

                // 验证refreshToken是否有效
                const user = this.verifyRefreshToken(refreshToken);
                if (!user) {
                    reject("refreshToken无效");
                    return;
                }

                // 从Redis中删除refreshToken
                const deleted = await redis.del(config.redis.head + refreshToken);

                if (deleted === 0) {
                    // Token可能已经过期或不存在
                    resolve("登出成功");
                    return;
                }

                resolve("登出成功");
            } catch (error) {
                reject(error.message || "登出失败");
            }
        });
    }

    /**
     * 获取用户信息
     * @param {number} userId - 用户ID
     */
    static async getUserInfo(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!userId) {
                    reject("用户ID不能为空");
                    return;
                }

                const user = await db("ba_blog_user")
                    .select("id", "name", "email", "phone", "regist_time", "status")
                    .where("id", userId)
                    .first();

                if (!user) {
                    reject("用户不存在");
                    return;
                }

                // 格式化返回数据
                const userInfo = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || null,
                    registTime: user.regist_time,
                    status: user.status,
                };

                resolve(userInfo);
            } catch (error) {
                reject(error.message || "获取用户信息失败");
            }
        });
    }

    /**
     * 更新用户信息
     * @param {number} userId - 用户ID
     * @param {object} updateData - 更新数据
     */
    static async updateUserInfo(userId, updateData) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!userId) {
                    reject("用户ID不能为空");
                    return;
                }

                // 过滤允许更新的字段
                const allowedFields = ["name", "phone"];
                const filteredData = {};

                for (const field of allowedFields) {
                    if (updateData[field] !== undefined) {
                        filteredData[field] = updateData[field];
                    }
                }

                if (Object.keys(filteredData).length === 0) {
                    reject("没有可更新的字段");
                    return;
                }

                // 验证用户名长度
                if (filteredData.name && (filteredData.name.length < 3 || filteredData.name.length > 12)) {
                    reject("用户名长度应在3-12位之间");
                    return;
                }

                // 验证手机号格式（如果提供）
                if (filteredData.phone && filteredData.phone.trim()) {
                    const phoneRegex = /^1[3-9]\d{9}$/;
                    if (!phoneRegex.test(filteredData.phone.trim())) {
                        reject("请输入正确的手机号");
                        return;
                    }
                    filteredData.phone = filteredData.phone.trim();
                }

                // 更新用户信息
                const updated = await db("ba_blog_user")
                    .where("id", userId)
                    .update(filteredData);

                if (updated === 0) {
                    reject("用户不存在或更新失败");
                    return;
                }

                // 返回更新后的用户信息
                const updatedUser = await this.getUserInfo(userId);
                resolve(updatedUser);
            } catch (error) {
                reject(error.message || "更新用户信息失败");
            }
        });
    }
}
module.exports = AuthService;
