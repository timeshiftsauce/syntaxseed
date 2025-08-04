<template>
  <div
    class="comment-form bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8"
  >
    <!-- 表单标题 -->
    <div class="mb-5">
      <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {{ replyTo ? "回复评论" : "发表评论" }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{
          replyTo ? `正在回复 ${replyTo.author} 的评论` : "分享你的想法和建议"
        }}
        <button
          v-if="replyTo"
          @click="cancelReply"
          class="text-primary dark:text-code-accent hover:underline ml-2"
        >
          取消回复
        </button>
      </p>
    </div>

    <!-- 表单内容 -->
    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <!-- 名称输入 -->
        <div class="form-group">
          <label
            for="author"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            名称 <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400"
            >
              <i class="pi pi-user"></i>
            </span>
            <input
              type="text"
              id="author"
              v-model="formData.author"
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 dark:focus:ring-code-accent/50 focus:border-primary dark:focus:border-code-accent outline-none transition-colors"
              :class="{ 'border-red-500 dark:border-red-500': errors.author }"
              placeholder="你的名称"
              @blur="validateField('author')"
            />
          </div>
          <p v-if="errors.author" class="mt-1 text-sm text-red-500">
            {{ errors.author }}
          </p>
        </div>

        <!-- 邮箱输入 -->
        <div class="form-group">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            邮箱 <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400"
            >
              <i class="pi pi-envelope"></i>
            </span>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 dark:focus:ring-code-accent/50 focus:border-primary dark:focus:border-code-accent outline-none transition-colors"
              :class="{ 'border-red-500 dark:border-red-500': errors.email }"
              placeholder="你的邮箱（不会公开）"
              @blur="validateField('email')"
            />
          </div>
          <p v-if="errors.email" class="mt-1 text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>
      </div>

      <!-- 网站输入（可选） -->
      <div class="form-group">
        <label
          for="website"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          网站（可选）
        </label>
        <div class="relative">
          <span
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400"
          >
            <i class="pi pi-globe"></i>
          </span>
          <input
            type="url"
            id="website"
            v-model="formData.website"
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 dark:focus:ring-code-accent/50 focus:border-primary dark:focus:border-code-accent outline-none transition-colors"
            placeholder="你的网站（选填）"
          />
        </div>
      </div>

      <!-- 评论内容 -->
      <div class="form-group">
        <label
          for="content"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          评论内容 <span class="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          v-model="formData.content"
          rows="5"
          class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 dark:focus:ring-code-accent/50 focus:border-primary dark:focus:border-code-accent outline-none transition-colors resize-y"
          :class="{ 'border-red-500 dark:border-red-500': errors.content }"
          placeholder="分享你的想法..."
          @blur="validateField('content')"
        ></textarea>
        <div class="flex justify-between items-center mt-1">
          <p v-if="errors.content" class="text-sm text-red-500">
            {{ errors.content }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formData.content.length }}/1000 字符
            <span v-if="formData.content.length > 1000" class="text-red-500"
              >（超出字数限制）</span
            >
          </p>
        </div>
        <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          支持基本的 Markdown 语法：**粗体**、*斜体*、[链接](url)、`代码`
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="submitting || hasErrors"
          class="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-teal-500 dark:from-code-accent dark:to-teal-400 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-code-accent/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center"
        >
          <i class="pi pi-send mr-2"></i>
          {{ submitting ? "提交中..." : "提交评论" }}
        </button>
      </div>
    </form>

    <!-- 提交成功提示 -->
    <div
      v-if="submitSuccess"
      class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-400 flex items-start"
    >
      <i class="pi pi-check-circle text-lg mr-2 mt-0.5"></i>
      <div>
        <p class="font-medium">评论提交成功！</p>
        <p class="text-sm mt-1" v-if="message">{{ message }}</p>
      </div>
    </div>

    <!-- 提交失败提示 -->
    <div
      v-if="submitError"
      class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-400 flex items-start"
    >
      <i class="pi pi-times-circle text-lg mr-2 mt-0.5"></i>
      <div>
        <p class="font-medium">评论提交失败</p>
        <p class="text-sm mt-1">{{ submitError }}</p>
        <button
          @click="submitForm"
          class="text-sm mt-2 underline hover:no-underline"
        >
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { submitComment } from "../api/comments";
const message = ref<null | string>(null);
// 导入统一的评论数据类型
import type { Comment } from "../api/comments";

// 定义组件属性
const props = defineProps<{
  blogId: string;
  replyTo?: Comment | null;
}>();

// 定义事件
const emit = defineEmits<{
  (e: "submitted", success: boolean): void;
  (e: "cancel-reply"): void;
}>();

// 表单数据
const formData = reactive({
  author: localStorage.getItem("comment_author") || "",
  email: localStorage.getItem("comment_email") || "",
  website: localStorage.getItem("comment_website") || "",
  content: "",
});

// 表单错误
const errors = reactive({
  author: "",
  email: "",
  content: "",
});

// 表单状态
const submitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref<string | null>(null);

// 计算属性：是否有错误
const hasErrors = computed(() => {
  return (
    !!errors.author ||
    !!errors.email ||
    !!errors.content ||
    formData.content.length > 1000
  );
});

// 验证字段
const validateField = (field: "author" | "email" | "content") => {
  if (field === "author") {
    if (!formData.author.trim()) {
      errors.author = "请输入你的名称";
    } else if (formData.author.length > 50) {
      errors.author = "名称不能超过50个字符";
    } else {
      errors.author = "";
    }
  }

  if (field === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "请输入你的邮箱";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "请输入有效的邮箱地址";
    } else {
      errors.email = "";
    }
  }

  if (field === "content") {
    if (!formData.content.trim()) {
      errors.content = "请输入评论内容";
    } else if (formData.content.length > 1000) {
      errors.content = "评论内容不能超过1000个字符";
    } else {
      errors.content = "";
    }
  }
};

// 验证所有字段
const validateForm = () => {
  validateField("author");
  validateField("email");
  validateField("content");
  return !hasErrors.value;
};

// 提交表单
const submitForm = async () => {
  // 验证表单
  if (!validateForm()) {
    return;
  }

  submitting.value = true;
  submitError.value = null;

  try {
    // 保存用户信息到本地存储
    localStorage.setItem("comment_author", formData.author);
    localStorage.setItem("comment_email", formData.email);
    if (formData.website) {
      localStorage.setItem("comment_website", formData.website);
    }

    // 构建评论数据
    const commentData = {
      blog_id: props.blogId,
      author: formData.author,
      email: formData.email,
      content: formData.content,
      website: formData.website || undefined,
      parent_id: props.replyTo?.id,
    };

    // 提交评论
    message.value = (await submitComment(commentData))?.message as
      | null
      | string;

    // 提交成功
    submitSuccess.value = true;
    formData.content = ""; // 清空评论内容
    emit("submitted", true);

    // 3秒后隐藏成功提示
    setTimeout(() => {
      submitSuccess.value = false;
      message.value = null;
    }, 5000);
  } catch (err: unknown) {
    console.error("提交评论失败:", err);
    submitError.value =
      (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message ||
      (err as { message?: string })?.message ||
      "提交评论失败，请稍后重试";
    emit("submitted", false);
  } finally {
    submitting.value = false;
  }
};

// 取消回复
const cancelReply = () => {
  emit("cancel-reply");
};

// 监听replyTo变化，自动聚焦评论框
watch(
  () => props.replyTo,
  (newReplyTo) => {
    if (newReplyTo) {
      // 在下一个DOM更新周期后聚焦评论框
      setTimeout(() => {
        const contentElement = document.getElementById("content");
        if (contentElement) {
          contentElement.focus();
        }
      }, 0);
    }
  },
);
</script>

<style lang="scss" scoped>
/* 表单输入框焦点样式 */
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 0, 102, 255), 0.2);

  .dark & {
    box-shadow: 0 0 0 3px rgba(var(--color-accent-cyan-rgb, 100, 255, 218), 0.2);
  }
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none !important;
    transform: none !important;
  }
}
</style>
