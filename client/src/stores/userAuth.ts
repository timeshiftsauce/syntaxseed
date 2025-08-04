import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "@/utils/toast.ts";
import router from "@/router";
import userApi from "@/api/userApi.ts";

// 用户信息接口
export interface UserInfo {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
}

export const useUserStore = defineStore("user", () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null);
  const savedUser = localStorage.getItem("userInfo");
  const Token = ref<string | null>(localStorage.getItem("Token"));
  const refreshToken = ref<string | null>(localStorage.getItem("refreshToken"));
  // 登录状态
  const isLoggedIn = computed(() => !!userInfo.value && !!Token.value);

  // 显示名称（优先昵称，其次邮箱）
  const displayName = computed(() => {
    if (!userInfo.value) return "";
    return userInfo.value.nickname || userInfo.value.email;
  });

  // 头像字符（昵称或邮箱的第一个字符）
  const avatarChar = computed(() => {
    if (!userInfo.value) return "";
    const name = userInfo.value.nickname || userInfo.value.email;
    return name.charAt(0).toUpperCase();
  });

  // 登录方法
  const login = async (
    email: string,
    password: string,
    captchaCode: string,
    captchaId: string,
    rememberMe: boolean = false,
  ) => {
    try {
      // 调用登录API
      const loginResult = await userApi.login(
        email,
        password,
        captchaCode,
        captchaId,
        rememberMe,
      );

      // 保存token
      SetRefreshTokens(loginResult.accessToken, loginResult.refreshToken);

      // 设置用户信息
      userInfo.value = {
        id: loginResult.user.id.toString(),
        nickname: loginResult.user.name,
        email: loginResult.user.email,
        avatar: undefined,
      };

      // 保存用户信息到localStorage
      localStorage.setItem("userInfo", JSON.stringify(userInfo.value));

      return loginResult;
    } catch (error) {
      console.error("登录失败:", error);
      throw error;
    }
  };

  // 登出方法
  const logout = async (redirect: boolean = true) => {
    userInfo.value = null;
    refreshToken.value &&
      userApi
        .logout()
        .then((res) => {
          if (!res) console.log("登出失败");
        })
        .catch((err) => {
          console.log("登出失败", err);
        });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("Token");
    localStorage.removeItem("refreshToken");
    await router.replace({
      path: "/",
    });
    // 显示退出成功消息
    toast.success("Success", "已退出账号");
  };

  // 初始化用户信息（从localStorage恢复）
  const initUser = () => {
    if (savedUser && Token) {
      try {
        userInfo.value = JSON.parse(savedUser);
      } catch (error) {
        console.error("解析用户信息失败:", error);
        localStorage.removeItem("userInfo");
        refreshToken.value && logout(false).then();
      }
    }
  };

  // 更新用户信息
  const updateUserInfo = (newInfo: Partial<UserInfo>) => {
    if (userInfo.value) {
      userInfo.value = { ...userInfo.value, ...newInfo };
      localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
    }
  };
  function SetRefreshTokens(
    new_token?: string | null,
    new_refreshToken?: string | null,
  ): void {
    if (new_token !== undefined) {
      Token.value = new_token;
      if (new_token) {
        localStorage.setItem("Token", new_token);
      } else {
        localStorage.removeItem("Token");
      }
    }
    if (new_refreshToken !== undefined) {
      refreshToken.value = new_refreshToken;
      if (new_refreshToken) {
        localStorage.setItem("refreshToken", new_refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }
    }
  }
  return {
    userInfo,
    Token,
    refreshToken,
    isLoggedIn,
    displayName,
    avatarChar,
    login,
    logout,
    initUser,
    updateUserInfo,
    SetRefreshTokens,
  };
});
