<template>
  <div class="auth-test-container">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-8 text-center">认证系统测试</h1>

      <!-- 用户状态显示 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">当前状态</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">登录状态</p>
            <p
              class="font-medium"
              :class="userStore.isLoggedIn ? 'text-green-600' : 'text-red-600'"
            >
              {{ userStore.isLoggedIn ? "已登录" : "未登录" }}
            </p>
          </div>
          <div v-if="userStore.userInfo">
            <p class="text-sm text-gray-600">用户信息</p>
            <p class="font-medium">
              {{ userStore.userInfo.nickname || userStore.userInfo.email }}
            </p>
          </div>
          <div v-if="userStore.Token">
            <p class="text-sm text-gray-600">Access Token</p>
            <p class="font-mono text-xs bg-gray-100 p-2 rounded break-all">
              {{ userStore.Token.substring(0, 50) }}...
            </p>
          </div>
          <div v-if="userStore.refreshToken">
            <p class="text-sm text-gray-600">Refresh Token</p>
            <p class="font-mono text-xs bg-gray-100 p-2 rounded break-all">
              {{ userStore.refreshToken.substring(0, 50) }}...
            </p>
          </div>
        </div>
      </div>

      <!-- 登录表单 -->
      <div
        v-if="!userStore.isLoggedIn"
        class="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h2 class="text-xl font-semibold mb-4">登录测试</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >邮箱</label
            >
            <input
              v-model="loginForm.email"
              type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test@syntaxseed.com"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >密码</label
            >
            <input
              v-model="loginForm.password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="test123456"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isLoading ? "登录中..." : "登录" }}
          </button>
        </form>
      </div>

      <!-- 测试按钮区域 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">功能测试</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            @click="testGetUserInfo"
            :disabled="isLoading"
            class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            获取用户信息
          </button>
          <button
            @click="testRefreshToken"
            :disabled="isLoading || !userStore.refreshToken"
            class="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            手动刷新Token
          </button>
          <button
            @click="testExpiredToken"
            :disabled="isLoading"
            class="bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50"
          >
            测试过期Token
          </button>
          <button
            @click="testAutoRefresh"
            :disabled="isLoading"
            class="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            测试自动刷新
          </button>
          <button
            @click="testProtectedResource"
            :disabled="isLoading || !userStore.Token"
            class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            测试受保护资源
          </button>
          <button
            @click="testBearerFormat"
            :disabled="isLoading || !userStore.Token"
            class="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 disabled:opacity-50"
          >
            测试Bearer格式
          </button>
          <button
            @click="clearTokens"
            :disabled="isLoading"
            class="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            清除Token
          </button>
          <button
            @click="handleLogout"
            :disabled="isLoading || !userStore.isLoggedIn"
            class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            登出
          </button>
        </div>
      </div>

      <!-- 测试日志 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">测试日志</h2>
          <button
            @click="clearLogs"
            class="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            清除日志
          </button>
        </div>
        <div
          class="bg-gray-900 text-green-400 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm"
        >
          <div v-for="(log, index) in logs" :key="index" class="mb-1">
            <span class="text-gray-500">[{{ log.time }}]</span>
            <span :class="getLogColor(log.type)">{{ log.message }}</span>
          </div>
          <div v-if="logs.length === 0" class="text-gray-500">
            等待测试操作...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "@/stores/userAuth";
import $http from "../../axios";

const userStore = useUserStore();
const isLoading = ref(false);
const logs = ref([]);

const loginForm = reactive({
  email: "test@syntaxseed.com",
  password: "test123456",
});

// 添加日志
const addLog = (message, type = "info") => {
  logs.value.push({
    time: new Date().toLocaleTimeString(),
    message,
    type,
  });
  // 自动滚动到底部
  setTimeout(() => {
    const logContainer = document.querySelector(".overflow-y-auto");
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, 100);
};

// 获取日志颜色
const getLogColor = (type) => {
  switch (type) {
    case "success":
      return "text-green-400";
    case "error":
      return "text-red-400";
    case "warning":
      return "text-yellow-400";
    default:
      return "text-green-400";
  }
};

// 清除日志
const clearLogs = () => {
  logs.value = [];
};

// 登录
const handleLogin = async () => {
  isLoading.value = true;
  addLog("开始登录测试...", "info");

  try {
    const response = await $http("/auth/login", {
      method: "POST",
      data: loginForm,
    });

    addLog(`登录成功: ${response.message}`, "success");

    if (response.data) {
      // 更新用户store
      userStore.userInfo = response.data.user;
      userStore.SetRefreshTokens(
        response.data.token,
        response.data.refreshToken,
      );

      addLog(
        `用户信息: ${response.data.user.nickname || response.data.user.email}`,
        "success",
      );
      addLog(
        `获得Token: ${response.data.token.substring(0, 20)}...`,
        "success",
      );
      addLog(
        `获得RefreshToken: ${response.data.refreshToken.substring(0, 20)}...`,
        "success",
      );
    }
  } catch (error) {
    addLog(`登录失败: ${error}`, "error");
  } finally {
    isLoading.value = false;
  }
};

// 获取用户信息
const testGetUserInfo = async () => {
  isLoading.value = true;
  addLog("测试获取用户信息...", "info");

  try {
    const response = await $http("/auth/me");
    addLog(`获取用户信息成功: ${JSON.stringify(response.data)}`, "success");
  } catch (error) {
    addLog(`获取用户信息失败: ${error}`, "error");
  } finally {
    isLoading.value = false;
  }
};

// 手动刷新Token
const testRefreshToken = async () => {
  isLoading.value = true;
  addLog("测试手动刷新Token...", "info");

  try {
    const response = await $http("/auth/refreshToken", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userStore.refreshToken}`,
      },
    });

    addLog(`Token刷新成功: ${response.message}`, "success");

    if (response.data?.token) {
      userStore.SetRefreshTokens(response.data.token);
      addLog(`新Token: ${response.data.token.substring(0, 20)}...`, "success");
    }
  } catch (error) {
    addLog(`Token刷新失败: ${error}`, "error");
  } finally {
    isLoading.value = false;
  }
};

// 测试过期Token
const testExpiredToken = async () => {
  isLoading.value = true;
  addLog("测试过期Token处理...", "info");

  // 模拟过期的token
  const originalToken = userStore.Token;
  userStore.SetRefreshTokens("expired_token_for_test");

  try {
    await $http("/auth/me");
    addLog("意外成功（应该失败）", "warning");
  } catch (error) {
    addLog(`过期Token被正确处理: ${error}`, "success");
  } finally {
    // 恢复原token
    userStore.SetRefreshTokens(originalToken);
    isLoading.value = false;
  }
};

// 测试自动刷新
const testAutoRefresh = async () => {
  isLoading.value = true;
  addLog("测试自动Token刷新机制...", "info");

  // 模拟一个会触发401的请求
  const originalToken = userStore.Token;
  userStore.SetRefreshTokens("expired_token_to_trigger_refresh");

  try {
    // 这个请求应该会触发自动刷新
    const response = await $http("/auth/me");
    addLog("自动刷新成功，获取到用户信息", "success");
  } catch (error) {
    addLog(`自动刷新测试结果: ${error}`, "warning");
  } finally {
    isLoading.value = false;
  }
};

// 测试受保护资源
const testProtectedResource = async () => {
  isLoading.value = true;
  addLog("测试访问受保护资源...", "info");

  try {
    const response = await $http("/auth/protected");
    addLog(`访问受保护资源成功: ${JSON.stringify(response.data)}`, "success");
  } catch (error) {
    addLog(`访问受保护资源失败: ${error}`, "error");
  } finally {
    isLoading.value = false;
  }
};

// 测试Bearer格式
const testBearerFormat = async () => {
  isLoading.value = true;
  addLog("测试Bearer Token格式...", "info");

  try {
    // 测试正确格式
    const response = await $http("/auth/verify", {
      method: "POST",
    });
    addLog(`Bearer格式验证成功: ${JSON.stringify(response.data)}`, "success");

    // 测试错误格式（这个会在axios拦截器中被修正，所以可能不会失败）
    addLog("Bearer格式测试完成", "info");
  } catch (error) {
    addLog(`Bearer格式测试失败: ${error}`, "error");
  } finally {
    isLoading.value = false;
  }
};

// 清除Token
const clearTokens = () => {
  addLog("清除所有Token...", "info");
  userStore.SetRefreshTokens(null, null);
  userStore.userInfo = null;
  addLog("Token已清除", "success");
};

// 登出
const handleLogout = async () => {
  isLoading.value = true;
  addLog("开始登出...", "info");

  try {
    await userStore.logout();
    addLog("登出成功", "success");
  } catch (error) {
    addLog(`登出失败: ${error}`, "error");
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时初始化
onMounted(() => {
  addLog("认证测试页面已加载", "info");
  userStore.initUser();

  if (userStore.isLoggedIn) {
    addLog("检测到已登录状态", "success");
  } else {
    addLog("当前未登录，请先登录进行测试", "warning");
  }
});
</script>

<style scoped>
.auth-test-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
