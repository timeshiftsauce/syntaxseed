<template>
  <view class="loginPage">
    <view class="container" :class="{ active: isLogin }">
      <view class="form-box login">
        <el-form class="form" :model="loginData" label-width="auto" :rules="loginRules" ref="loginFormRef">
          <view class="form-header">
            <button type="button" class="back-btn" @click="goBack" title="返回上一页">
              <el-icon>
                <ArrowLeft />
              </el-icon>
            </button>
            <h1>登录</h1>
          </view>

          <el-form-item prop="email">
            <el-input v-model="loginData.email" placeholder="请输入邮箱" type="text" :suffix-icon="Message" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginData.password" type="password" placeholder="请输入密码" :show-password="true" />
          </el-form-item>
          <el-form-item prop="captcha">
            <view class="captcha-container">
              <el-input v-model="loginData.captcha" type="text" placeholder="请输入图片验证码" :clearable="true"
                class="captcha-input" />
              <view class="captcha-image-wrapper">
                <img v-if="captchaData.imageUrl && !captchaData.loading" :src="captchaData.imageUrl" alt="验证码"
                  class="captcha-image" @click="refreshCaptcha" title="点击刷新验证码" />
                <view v-else class="captcha-loading">
                  <el-icon class="is-loading">
                    <Loading />
                  </el-icon>
                </view>
              </view>
            </view>
          </el-form-item>
          <view class="forgot-link">
            <a href="#">忘记密码？</a>
          </view>
          <button type="submit" class="btn" @click.prevent="handleLogin" :disabled="loginLoading">
            <el-icon v-if="loginLoading" class="is-loading">
              <Loading />
            </el-icon>
            {{ loginLoading ? "登录中..." : "登录" }}
          </button>
        </el-form>
      </view>

      <view class="form-box register">
        <el-form :model="registData" :rules="registerRules" ref="registerFormRef">
          <view class="form-header">
            <button type="button" class="back-btn" @click="goBack" title="返回上一页">
              <el-icon>
                <ArrowLeft />
              </el-icon>
            </button>
            <h1>注册</h1>
          </view>
          <el-form-item prop="username">
            <el-input v-model="registData.username" placeholder="请输入用户名" type="text" :suffix-icon="UserFilled" />
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="registData.email" placeholder="请输入邮箱" type="text" :suffix-icon="Message" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registData.password" type="password" placeholder="请输入密码" :show-password="true" />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="registData.confirmPassword" type="password" placeholder="请确认密码" :show-password="true" />
          </el-form-item>
          <el-form-item prop="captcha">
            <view class="captcha-container">
              <el-input v-model="registData.captcha" type="text" placeholder="请输入图片验证码" :clearable="true"
                class="captcha-input" />
              <view class="captcha-image-wrapper">
                <img v-if="captchaData.imageUrl && !captchaData.loading" :src="captchaData.imageUrl" alt="验证码"
                  class="captcha-image" @click="refreshCaptcha" title="点击刷新验证码" />
                <view v-else class="captcha-loading">
                  <el-icon class="is-loading">
                    <Loading />
                  </el-icon>
                </view>
              </view>
            </view>
          </el-form-item>
          <el-form-item prop="emailCode">
            <view class="email-code-container">
              <el-input v-model="registData.emailCode" type="text" placeholder="请输入邮箱验证码" :clearable="true"
                class="email-code-input" />
              <el-button type="primary" :disabled="!canSendEmailCode || emailCodeCountdown > 0"
                :loading="emailCodeSending" @click="sendEmailCode" class="send-code-btn">
                {{
                  emailCodeCountdown > 0
                    ? `${emailCodeCountdown}s`
                    : "发送验证码"
                }}
              </el-button>
            </view>
          </el-form-item>

          <el-form-item prop="agreeTerms">
            <el-checkbox v-model="registData.agreeTerms">
              我已阅读并同意<a href="#" style="color: #7494ec">用户协议</a>和<a href="#" style="color: #7494ec">隐私政策</a>
            </el-checkbox>
          </el-form-item>
          <button type="submit" class="btn" @click.prevent="handleRegister" :disabled="registerLoading">
            <el-icon v-if="registerLoading" class="is-loading">
              <Loading />
            </el-icon>
            {{ registerLoading ? "注册中..." : "注册" }}
          </button>
        </el-form>
      </view>

      <view class="toggle-box">
        <view class="toggle-panel toggle-left">
          <h1>SyntaxSeed，登录!</h1>
          <p>你还没有账户?</p>
          <button class="btn register-btn" @click="isLogin = true">
            去注册
          </button>
        </view>

        <view class="toggle-panel toggle-right">
          <h1>SyntaxSeed，注册!</h1>
          <p>你已经注册了?</p>
          <button class="btn login-btn" @click="isLogin = false">去登录</button>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useUserStore } from "@/stores/userAuth";
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from "vue-router";
import {
  Message,
  UserFilled,
  Loading,
  ArrowLeft,
} from "@element-plus/icons-vue";
import UserApi from "@/api/userApi";
import type { CaptchaData, FormRules } from "@/utils/apiType";
import type { FormInstance } from "element-plus";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const isLogin = ref(false);

// 表单引用
const loginFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();

// 登录表单数据
const loginData = ref({
  email: "",
  password: "",
  captcha: "",
  captchaId: "",
  rememberMe: false,
});

// 注册表单数据
const registData = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  emailCode: "",
  captcha: "",
  captchaId: "",
  agreeTerms: false,
});

// 验证码数据
const captchaData = ref<CaptchaData>({
  id: "",
  imageUrl: "",
  loading: false,
});

// 邮箱验证码相关状态
const emailCodeSending = ref(false);
const emailCodeCountdown = ref(0);
let countdownTimer: NodeJS.Timeout | null = null;

// 登录状态
const loginLoading = ref(false);
const registerLoading = ref(false);

// 用户状态管理
const userStore = useUserStore();

// 表单验证规则
const loginRules = reactive<FormRules>({
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "请输入正确的邮箱格式",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少6位", trigger: "blur" },
    { max: 20, message: "密码长度不能超过20位", trigger: "blur" },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (!value) {
          callback();
          return;
        }
        function validatePassword(pass) {
          const regex = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,16}$/;
          return regex.test(pass);
        }
        if (!validatePassword(value)) {
          callback(new Error("必须包含数字,字母或特殊符号任意2种"));

        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  captcha: [
    { required: true, message: "请输入图片验证码", trigger: "blur" },
    { min: 4, max: 6, message: "验证码长度为4-6位", trigger: "blur" },
  ],
});

const registerRules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 12, message: "用户名长度在3-12个字符", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
      message: "用户名只能包含字母、数字、下划线和中文",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    {
      pattern: /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/,
      message: "请输入正确的邮箱格式",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, message: "密码长度至少6位", trigger: "blur" },
    { max: 16, message: "密码长度不能超过20位", trigger: "blur" },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (!value) {
          callback();
          return;
        }
        function validatePassword(pass) {
          const regex = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{8,16}$/;
          return regex.test(pass);
        }
        if (!validatePassword(value)) {
          callback(new Error("必须包含数字,字母或特殊符号任意2种"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value !== registData.value.password) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  emailCode: [
    { required: true, message: "请输入邮箱验证码", trigger: "blur" },
    {
      min: 6,
      max: 6,
      message: "验证码长度为6位",
      trigger: "blur",
    },
    {
      pattern: /^\d{6}$/,
      message: "验证码必须为6位数字",
      trigger: "blur",
    },
  ],
  captcha: [
    { required: true, message: "请输入图片验证码", trigger: "blur" },
    { min: 4, max: 6, message: "验证码长度为4-6位", trigger: "blur" },
  ],
  agreeTerms: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (!value) {
          callback(new Error("请阅读并同意用户协议和隐私政策"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
});

// 计算属性：是否可以发送邮箱验证码
const canSendEmailCode = computed(() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    emailPattern.test(registData.value.email) &&
    registData.value.captcha &&
    captchaData.value.id
  );
});

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!canSendEmailCode.value) {
    toast.add({
      severity: "warn",
      summary: "提示",
      detail: "请先输入正确的邮箱地址和图片验证码",
      life: 3000,
    });
    return;
  }

  try {
    emailCodeSending.value = true;
    await UserApi.sendEmailCode(
      registData.value.email,
      registData.value.captcha,
      registData.value.captchaId,
    );

    toast.add({
      severity: "success",
      summary: "成功",
      detail: "验证码已发送到您的邮箱，请查收",
      life: 3000,
    });

    // 开始倒计时
    startCountdown();
  } catch (error) {
    console.error("发送邮箱验证码失败:", error);
    toast.add({
      severity: "error",
      summary: "错误",
      detail: typeof error === "string" ? error : "发送验证码失败，请重试",
      life: 3000,
    });
    // 发送失败时刷新验证码
    await refreshCaptcha();
  } finally {
    emailCodeSending.value = false;
  }
};

// 开始倒计时
const startCountdown = () => {
  emailCodeCountdown.value = 60;
  countdownTimer = setInterval(() => {
    emailCodeCountdown.value--;
    if (emailCodeCountdown.value <= 0) {
      clearInterval(countdownTimer!);
      countdownTimer = null;
    }
  }, 1000);
};

// 获取图形验证码
const getCaptcha = async () => {
  try {
    captchaData.value.loading = true;
    const response = await UserApi.getCaptcha();
    captchaData.value.id = response.id;
    captchaData.value.imageUrl = `data:image/svg+xml;base64,${response.captcha}`;
    loginData.value.captchaId = response.id;
    registData.value.captchaId = response.id;
  } catch (error) {
    console.error("获取验证码失败:", error);
    toast.add({
      severity: "error",
      summary: "错误",
      detail: "获取验证码失败，请重试",
      life: 3000,
    });
  } finally {
    captchaData.value.loading = false;
  }
};

// 刷新验证码
const refreshCaptcha = async () => {
  // 清空当前验证码输入
  loginData.value.captcha = "";
  registData.value.captcha = "";
  await getCaptcha();
};

// 组件挂载时获取验证码
onMounted(() => {
  getCaptcha();
});

// 验证登录表单
const validateLoginForm = async (): Promise<boolean> => {
  if (!loginFormRef.value) return false;
  try {
    await loginFormRef.value.validate();
    return true;
  } catch (error) {
    console.error("登录表单验证失败:", error);
    return false;
  }
};

// 验证注册表单
const validateRegisterForm = async (): Promise<boolean> => {
  if (!registerFormRef.value) return false;
  try {
    await registerFormRef.value.validate();
    return true;
  } catch (error) {
    console.error("注册表单验证失败:", error);
    return false;
  }
};

// 获取重定向路径
const getRedirectPath = (): string => {
  const redirect = route.query.redirect as string;
  return redirect || "/";
};

// 处理登录表单提交
const handleLogin = async () => {
  // 验证表单
  const isValid = await validateLoginForm();
  if (!isValid) {
    return;
  }

  try {
    loginLoading.value = true;

    // 通过Store调用登录API
    await userStore.login(
      loginData.value.email,
      loginData.value.password,
      loginData.value.captcha,
      loginData.value.captchaId,
      loginData.value.rememberMe,
    );

    // 显示成功提示
    toast.add({
      severity: "success",
      summary: "登录成功",
      detail: `欢迎回来，${userStore.displayName}！`,
      life: 3000,
    });

    // 跳转到指定页面或首页
    const redirectPath = getRedirectPath();
    await router.push(redirectPath);
  } catch (error) {
    console.error("登录失败:", error);

    // 显示错误提示
    const errorMessage =
      typeof error === "string" ? error : "登录失败，请检查您的账号和密码";
    toast.add({
      severity: "error",
      summary: "登录失败",
      detail: errorMessage,
      life: 5000,
    });

    // 刷新验证码
    await refreshCaptcha();

    // 清空验证码输入
    loginData.value.captcha = "";
  } finally {
    loginLoading.value = false;
  }
};

// 处理注册表单提交
const handleRegister = async () => {
  // 验证表单
  const isValid = await validateRegisterForm();
  if (!isValid) {
    return;
  }

  try {
    registerLoading.value = true;

    // 调用注册API
    const registerResult = await UserApi.register(
      registData.value.username,
      registData.value.password,
      registData.value.email,
      registData.value.emailCode,
      registData.value.captcha,
      registData.value.captchaId,
    );

    // 注册成功后自动登录（后端已返回token）
    userStore.SetRefreshTokens(
      registerResult.accessToken,
      registerResult.refreshToken,
    );

    // 设置用户信息
    const newUserInfo = {
      id: registerResult.user.id.toString(),
      nickname: registerResult.user.name,
      email: registerResult.user.email,
      avatar: undefined,
    };

    userStore.updateUserInfo(newUserInfo);

    // 直接设置 userInfo（因为 updateUserInfo 需要现有用户信息）
    userStore.userInfo = newUserInfo;
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));

    // 显示成功提示
    toast.add({
      severity: "success",
      summary: "注册成功",
      detail: `欢迎加入 SyntaxSeed，${userStore.displayName}！`,
      life: 3000,
    });

    // 跳转到指定页面或首页
    const redirectPath = getRedirectPath();
    await router.push(redirectPath);
  } catch (error) {
    console.error("注册失败:", error);

    // 显示错误提示
    let errorMessage = "注册失败，请重试";
    if (typeof error === "string") {
      if (
        error.includes("邮箱已存在") ||
        error.includes("email already exists")
      ) {
        errorMessage = "该邮箱已被注册，请使用其他邮箱或直接登录";
      } else if (
        error.includes("用户名已存在") ||
        error.includes("username already exists")
      ) {
        errorMessage = "该用户名已被使用，请选择其他用户名";
      } else if (
        error.includes("验证码") ||
        error.includes("captcha") ||
        error.includes("code")
      ) {
        errorMessage = "验证码错误或已过期，请重新获取";
      } else {
        errorMessage = error;
      }
    }

    toast.add({
      severity: "error",
      summary: "注册失败",
      detail: errorMessage,
      life: 5000,
    });

    // 刷新验证码
    await refreshCaptcha();

    // 清空验证码输入
    registData.value.captcha = "";

    // 如果是邮箱验证码相关错误，清空邮箱验证码
    if (errorMessage.includes("验证码")) {
      registData.value.emailCode = "";
    }
  } finally {
    registerLoading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  // 如果有历史记录，返回上一页
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    // 否则跳转到首页
    router.push("/");
  }
};

// 组件卸载时清理倒计时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>
<style lang="scss" scoped>
.loginPage,
.loginPage * {
  box-sizing: border-box;
}

.btn {
  width: 100%;
  height: 48px;
  background-color: #7494ec;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  transition-timing-function: ease;
  transition-duration: 0ms;
}

.loginPage {
  background: linear-gradient(90deg, #e2e2e2, #c9d6ff);

  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .container {
    :deep(.el-form) {
      width: 100%;
      margin: auto 0;

      .captcha-container,
      .email-code-container {
        width: 100%;
      }

      .el-input__wrapper {
        width: 100%;
        height: 40px;
        background-color: #eee;
        border: none;
        outline: none;
        font-size: 14px;
        border-radius: 8px;
        color: #333;
        font-weight: 500;
      }
    }

    position: relative;
    width: 850px;
    height: 550px;
    background-color: #fff;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
    margin: 20px;
    overflow: hidden;

    .form-header {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 20px;

      .back-btn {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        color: #666;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: #f5f5f5;
          color: #7494ec;
        }

        .el-icon {
          font-size: 20px;
        }
      }

      h1 {
        font-size: 36px;
        margin: 0;
        flex: 1;
        text-align: center;
      }
    }

    h1 {
      font-size: 36px;
      margin: 10px 0;
    }

    .form-box {
      overflow-y: auto;
      scrollbar-width: none;
      position: absolute;
      right: 0;
      width: 50%;
      height: 100%;
      background-color: #fff;
      display: flex;
      align-items: center;
      color: #333;
      text-align: center;
      padding: 40px !important;
      z-index: 1;
      transition:
        0.6s ease-in-out 1.2s,
        visibility 0s 1s;

      &.register {
        visibility: hidden;
      }
    }

    &.active {
      .toggle-box::before {
        left: 50%;
      }

      .form-box {
        right: 50%;

        &.register {
          visibility: visible;
        }
      }
    }

    .email-code-container {
      display: flex;
      gap: 10px;
      align-items: center;

      .email-code-input {
        flex: 1;
      }

      .send-code-btn {
        width: 120px;
        height: 40px;
        font-size: 14px;
        white-space: nowrap;
      }
    }

    .captcha-container {
      display: flex;
      gap: 10px;
      align-items: center;

      .captcha-input {
        flex: 1;
      }

      .captcha-image-wrapper {
        width: 120px;
        height: 40px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fa;

        .captcha-image {
          width: 100%;
          height: 100%;
          cursor: pointer;
          border-radius: 4px;
          transition: opacity 0.3s ease;

          &:hover {
            opacity: 0.8;
          }
        }

        .captcha-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          color: #909399;

          .el-icon {
            font-size: 16px;
          }
        }
      }
    }

    .forgot-link {
      margin: -15px 0 15px;

      a {
        font-size: 14.5px;
        color: #333;
        text-decoration: none;
      }
    }

    p {
      font-size: 14.5px !important;
      margin: 15px 0 !important;
    }

    .social-icons {
      display: flex;
      justify-content: center;
    }

    .social-icons a {
      display: inline-flex;
      padding: 10px;
      border: 2px solid #ccc;
      border-radius: 8px;
      font-size: 24px;
      color: #333;
      text-decoration: none;
      margin: 0 8px;
    }

    .toggle-box {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .toggle-box::before {
      content: "";
      position: absolute;
      left: -250%;
      width: 300%;
      height: 100%;
      background-color: #7494ec;
      z-index: 2;
      border-radius: 150px;
      transition: 1.8s ease-in-out;
    }

    .toggle-panel {
      position: absolute;
      width: 50%;
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2;
      transition: 0.6s ease-in-out;

      &.toggle-left {
        left: 0;
        transition-delay: 1.2s;
      }

      &.toggle-right {
        right: -50%;
        transition-delay: 0.6s;
      }

      .btn {
        width: 160px;
        height: 46px;
        background-color: transparent;
        border: 2px solid #fff;
        box-shadow: none;
      }
    }

    &.active {
      .toggle-panel {
        p {
          margin-bottom: 20px;
        }

        &.toggle-left {
          left: -50%;
          transition-delay: 0.6s;
        }

        &.toggle-right {
          right: 0;
          transition-delay: 1.2s;
        }
      }
    }
  }

  @media screen and (max-width: 650px) {
    .container {
      height: calc(100vh) !important;
      padding: 0 !important;
      margin: 0 !important;
      border-radius: 0;
    }

    .form-box {
      bottom: 0 !important;
      width: 100% !important;
      height: 70% !important;
    }

    .container.active .form-box {
      right: 0 !important;
      bottom: 30% !important;
    }

    .toggle-box::before {
      left: 0 !important;
      width: 100% !important;
      top: -270% !important;
      height: 300% !important;
      border-radius: 20vw !important;
    }

    .container.active .toggle-box::before {
      left: 0 !important;
      top: 70% !important;
    }

    .toggle-panel {
      width: 100% !important;
      height: 30% !important;
    }

    .toggle-panel.toggle-left {
      top: 0 !important;
    }

    .container.active .toggle-panel.toggle-left {
      left: 0 !important;
      top: -30% !important;
    }

    .toggle-panel.toggle-right {
      right: 0 !important;
      bottom: -30% !important;
    }

    .container.active .toggle-panel.toggle-right {
      bottom: 0 !important;
    }
  }

  @media screen and (max-width: 400px) {
    .form-box {
      padding: 20px !important;
    }

    .toggle-panel h1 {
      font-size: 30px !important;
    }
  }
}
</style>
