import $http from "../../axios";
import type {
  captchaResponse,
  loginResponse,
  logoutResponse,
  registerResponse,
  sendEmailCodeResponse,
  verifyEmailCodeResponse,
} from "@/utils/apiType.ts";

class UserApi {
  static getCaptcha() {
    return new Promise<captchaResponse>((resolve, reject) => {
      $http<captchaResponse>("/auth/captcha", {
        method: "GET",
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 发送邮箱验证码
  static sendEmailCode(email: string, captchaCode: string, captchaId: string) {
    return new Promise<sendEmailCodeResponse>((resolve, reject) => {
      $http<sendEmailCodeResponse>("/auth/send-email-code", {
        method: "POST",
        showLoading: false,
        data: {
          email,
          captchaCode,
          captchaId,
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 验证邮箱验证码
  static verifyEmailCode(email: string, emailCode: string) {
    return new Promise<verifyEmailCodeResponse>((resolve, reject) => {
      $http<verifyEmailCodeResponse>("/auth/verify-email-code", {
        method: "POST",
        showLoading: false,
        data: {
          email,
          emailCode,
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  static login(
    email: string,
    password: string,
    captchaCode: string,
    captchaId: string,
    rememberMe: boolean = false,
  ) {
    return new Promise<loginResponse["data"]>((resolve, reject) => {
      $http<loginResponse>("/auth/login", {
        showLoading: false,
        method: "POST",
        data: {
          email,
          password,
          captchaCode,
          captchaId,
          rememberMe,
        },
      })
        .then((response) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  static register(
    username: string,
    password: string,
    email: string,
    emailCode: string,
    captchaCode: string,
    captchaId: string,
  ) {
    return new Promise<registerResponse["data"]>((resolve, reject) => {
      $http<registerResponse>("/auth/register", {
        showLoading: false,
        method: "POST",
        data: {
          username,
          password,
          email,
          emailCode,
          captchaCode,
          captchaId,
          login: true,
        },
      })
        .then((response) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(response.message);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  static logout() {
    return new Promise<boolean>((resolve, reject) => {
      $http<logoutResponse>("/auth/logout", {
        method: "POST",
        showLoading: false,
      })
        .then((response) => {
          if (response.success) {
            resolve(true);
          } else {
            reject(response.message);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
export default UserApi;
