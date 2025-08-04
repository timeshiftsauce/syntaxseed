const nodemailer = require('nodemailer');
const { config } = require('../config/env');

class EmailService {
  constructor() {
    // 创建邮件传输器
    this.transporter = nodemailer.createTransport(config.mail);

  }

  /**
   * 发送邮箱验证码
   * @param {string} email - 目标邮箱
   * @param {string} code - 验证码
   * @param {number} expireMinutes - 过期时间（分钟）
   */
  async sendVerificationCode(email, code, expireMinutes = 5) {
    const mailOptions = {
      from: config.mail.from,
      to: email,
      subject: 'SyntaxSeed博客 - 邮箱验证码',
      html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Arial', sans-serif;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2a9d8f; margin: 0;">SyntaxSeed</h1>
                        <p style="color: #666; margin: 5px 0;">时迁酱&博客</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; border-left: 4px solid #2a9d8f;">
                        <h2 style="color: #333; margin-top: 0;">邮箱验证码</h2>
                        <p style="color: #666; line-height: 1.6;">
                            您正在注册 <a href="https://shiqianjiang.cn/">SyntaxSeed</a> 账户，请使用以下验证码完成注册：
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="display: inline-block; background: #2a9d8f; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 6px;">
                                ${code}
                            </span>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            验证码有效期为 <strong>${expireMinutes} 分钟</strong>，请及时使用。
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                            <p style="color: #999; font-size: 14px; margin: 0;">
                                如果您没有请求此验证码，请忽略此邮件。
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
                        <p>© 2024 SyntaxSeed. All rights reserved.</p>
                    </div>
                </div>
            `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('验证码邮件发送成功:', info.messageId);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('发送验证码邮件失败:', error);
      throw new Error('邮件发送失败');
    }
  }

  /**
   * 测试邮件服务连接
   */
  async testConnection() {
    try {

      await this.transporter.verify();
      console.log('邮件服务连接正常');
      return true;
    } catch (error) {
      console.log(JSON.stringify(config.mail));
      console.error('邮件服务连接失败:', error);
      return false;
    }
  }
}

module.exports = new EmailService();