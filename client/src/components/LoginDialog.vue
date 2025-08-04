<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="isLogin ? '登录' : '注册'"
    :style="{ width: '400px' }"
    :closable="true"
    :draggable="false"
    class="login-dialog"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- 邮箱输入 -->
      <div class="field">
        <label for="email" class="block text-sm font-medium mb-2">邮箱</label>
        <InputText
          id="email"
          v-model="form.email"
          type="email"
          placeholder="请输入邮箱"
          class="w-full"
          :class="{ 'p-invalid': errors.email }"
          required
        />
        <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
      </div>

      <!-- 昵称输入（注册时显示） -->
      <div v-if="!isLogin" class="field">
        <label for="nickname" class="block text-sm font-medium mb-2"
          >昵称</label
        >
        <InputText
          id="nickname"
          v-model="form.nickname"
          placeholder="请输入昵称"
          class="w-full"
          :class="{ 'p-invalid': errors.nickname }"
        />
        <small v-if="errors.nickname" class="p-error">{{
          errors.nickname
        }}</small>
      </div>

      <!-- 密码输入 -->
      <div class="field">
        <label for="password" class="block text-sm font-medium mb-2"
          >密码</label
        >
        <Password
          id="password"
          v-model="form.password"
          placeholder="请输入密码"
          class="w-full"
          :class="{ 'p-invalid': errors.password }"
          :feedback="false"
          toggle-mask
          required
        />
        <small v-if="errors.password" class="p-error">{{
          errors.password
        }}</small>
      </div>

      <!-- 确认密码（注册时显示） -->
      <div v-if="!isLogin" class="field">
        <label for="confirmPassword" class="block text-sm font-medium mb-2"
          >确认密码</label
        >
        <Password
          id="confirmPassword"
          v-model="form.confirmPassword"
          placeholder="请再次输入密码"
          class="w-full"
          :class="{ 'p-invalid': errors.confirmPassword }"
          :feedback="false"
          toggle-mask
        />
        <small v-if="errors.confirmPassword" class="p-error">{{
          errors.confirmPassword
        }}</small>
      </div>

      <!-- 提交按钮 -->
      <Button
        type="submit"
        :label="isLogin ? '登录' : '注册'"
        class="w-full"
        :loading="loading"
        :disabled="loading"
      />

      <!-- 切换登录/注册 -->
      <div class="text-center">
        <Button
          :label="isLogin ? '没有账号？去注册' : '已有账号？去登录'"
          link
          @click="toggleMode"
          class="text-sm"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useUserStore } from "@/stores/userAuth.js";
import { useToast } from "primevue/usetoast";

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["update:visible", "login-success"]);

// Composables
const userStore = useUserStore();
const toast = useToast();

// 响应式数据
const isLogin = ref(true);
const loading = ref(false);

const form = reactive({
  email: "",
  nickname: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({
  email: "",
  nickname: "",
  password: "",
  confirmPassword: "",
});

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

// 方法
const validateForm = () => {
  // 清空错误
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  let isValid = true;

  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = "请输入邮箱";
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = "请输入有效的邮箱地址";
    isValid = false;
  }

  // 密码验证
  if (!form.password) {
    errors.password = "请输入密码";
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = "密码至少6位";
    isValid = false;
  }

  // 注册时的额外验证
  if (!isLogin.value) {
    if (!form.nickname) {
      errors.nickname = "请输入昵称";
      isValid = false;
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = "请确认密码";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "两次密码输入不一致";
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;

  try {
    if (isLogin.value) {
      // 登录逻辑
      const success = await userStore.login(form.email, form.password);
      if (success) {
        toast.add({
          severity: "success",
          summary: "登录成功",
          detail: "欢迎回来！",
          life: 3000,
        });
        emit("login-success");
        visible.value = false;
        resetForm();
      }
    } else {
      // 注册逻辑（暂时模拟）
      // TODO: 实际的注册API调用
      toast.add({
        severity: "success",
        summary: "注册成功",
        detail: "请登录您的账号",
        life: 3000,
      });
      isLogin.value = true;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: isLogin.value ? "登录失败" : "注册失败",
      detail: error.message || "请稍后重试",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  resetForm();
};

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = "";
  });
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
};

// 监听对话框关闭，重置表单
watch(visible, (newVal) => {
  if (!newVal) {
    resetForm();
    isLogin.value = true;
  }
});
</script>

<style lang="scss" scoped>
.login-dialog {
  :deep(.p-dialog-header) {
    background: var(--color-primary-light);
    color: var(--color-primary-dark);

    .dark & {
      background: var(--color-primary-dark);
      color: var(--color-primary-light);
    }
  }

  :deep(.p-dialog-content) {
    background: var(--color-primary-light);

    .dark & {
      background: var(--color-primary-dark);
    }
  }

  .field {
    label {
      color: var(--color-primary-dark);

      .dark & {
        color: var(--color-primary-light);
      }
    }
  }
}
</style>
