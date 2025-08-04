// 这里是所有接口类

interface response {
  total?: number;
  spendTime?: string;
  code: 200 | 400 | 401 | 500;
  limit?: number;
  page?: number;
}
export interface Blog extends response {
  data: {
    id: number | string;
    title: string;
    create_time: number;
    readTime: number;
    tags: string[];
    image: string;
    excerpt: string;
  }[];
  keywords: string;
}
export interface Project extends response {
  data: {
    id: string | number;
    weigh: number;
    title: string;
    description: string;
    images: [];
    category: string;
    features: string[];
    techStack: string[];
    demoUrl: string;
    codeUrl: string;
    tags: string[];
    image: string;
  }[];
}
export interface Config {
  Introduction: string;
  link: string;
  minTitle: string;
  title: string;
  record_number: string;
  upload_cdn_url: string;
}
export interface TypewriterTexts extends response {
  data: string[];
}
export interface TechStack {
  data: {
    id: number;
    status: 0 | 1;
    create_time: number;
    name: string;
    level: number;
  }[];
}
export interface refreshApi {
  success: boolean;
  code: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
export interface captchaResponse {
  id: string;
  captcha: string;
}

// 邮箱验证码相关接口
export interface sendEmailCodeRequest {
  email: string;
  captchaCode: string;
  captchaId: string;
}

export interface sendEmailCodeResponse {
  success: boolean;
  code: number;
  message: string;
}

export interface verifyEmailCodeRequest {
  email: string;
  emailCode: string;
}

export interface verifyEmailCodeResponse {
  success: boolean;
  code: number;
  message: string;
  data?: {
    verified: boolean;
  };
}
export interface loginResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      phone?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}
export interface logoutResponse {
  success: boolean;
  code: number;
  message: string;
}
export type registerResponse = loginResponse;

// 表单数据类型定义
export interface LoginForm {
  email: string;
  password: string;
  captcha: string;
  captchaId: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  emailCode: string;
  captcha: string;
  captchaId: string;
  agreeTerms?: boolean;
}

export interface CaptchaData {
  id: string;
  imageUrl: string;
  loading: boolean;
}

// 错误处理类型定义
export enum AuthErrorType {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  CAPTCHA_EXPIRED = "CAPTCHA_EXPIRED",
  EMAIL_CODE_EXPIRED = "EMAIL_CODE_EXPIRED",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  NETWORK_ERROR = "NETWORK_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

export interface AuthError {
  type: AuthErrorType;
  message: string;
  field?: string;
}

// 表单验证规则类型定义
export interface FormRule {
  required?: boolean;
  message?: string;
  trigger?: string | string[];
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: any, value: any, callback: any) => void;
}

export interface FormRules {
  [key: string]: FormRule | FormRule[];
}
