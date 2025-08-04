<template>
  <div
    class="comment-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
    :class="{
      'border-l-4 border-l-primary/30 dark:border-l-code-accent/30':
        level === 1,
      'border-l-4 border-l-teal-500/30 dark:border-l-teal-400/30': level === 2,
    }"
  >
    <div class="flex items-start">
      <!-- 用户头像 -->
      <div class="flex-shrink-0">
        <div
          v-if="comment.avatar"
          class="w-10 h-10 rounded-full overflow-hidden"
        >
          <img
            :src="comment.avatar"
            :alt="`${comment.author}的头像`"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-teal-500/20 dark:from-code-accent/20 dark:to-teal-400/20 flex items-center justify-center"
        >
          <span
            class="text-primary dark:text-code-accent font-medium text-lg"
            >{{ getInitials(comment.author) }}</span
          >
        </div>
      </div>

      <!-- 评论内容 -->
      <div class="ml-4 flex-1 min-w-0 overflow-hidden">
        <div class="flex items-center flex-wrap gap-2">
          <!-- 作者名称 -->
          <div class="flex items-center">
            <h4 class="font-medium text-gray-900 dark:text-white">
              <a
                v-if="comment.website"
                :href="ensureHttpPrefix(comment.website)"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-primary dark:hover:text-code-accent transition-colors flex items-center"
              >
                {{ comment.author }}
                <i class="pi pi-external-link text-xs ml-1 opacity-70"></i>
              </a>
              <span v-else>{{ comment.author }}</span>
            </h4>
          </div>

          <!-- 时间戳 -->
          <span
            class="text-sm text-gray-500 dark:text-gray-400 flex items-center"
          >
            <i class="pi pi-clock mr-1 text-xs opacity-70"></i>
            {{ formatDate(comment.create_time) }}
          </span>

          <!-- 评论层级标识 -->
          <span
            v-if="level > 0"
            class="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            {{ level === 1 ? "回复" : "二级回复" }}
          </span>
        </div>

        <!-- 评论内容 -->
        <div
          ref="commentContentRef"
          class="mt-3 text-gray-700 dark:text-gray-300 comment-content leading-relaxed w-full overflow-hidden"
          v-html="formattedContent"
        ></div>

        <!-- 回复按钮 -->
        <div class="mt-3 flex items-center">
          <button
            @click="$emit('reply', comment)"
            class="text-sm text-primary dark:text-code-accent hover:bg-primary/10 dark:hover:bg-code-accent/10 flex items-center px-3 py-1.5 rounded-full transition-colors"
          >
            <i class="pi pi-reply mr-1"></i> 回复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  computed,
  onMounted,
  nextTick,
  watch,
  ref,
} from "vue";
import DOMPurify from "dompurify";
import { marked } from "marked";
import Prism from "prismjs";
// 导入基本语言支持
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
// 导入行号插件
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

// 导入统一的评论数据类型
import type { Comment } from "../api/comments";

// 定义组件属性
const props = defineProps<{
  comment: Comment;
  level: number;
}>();

// 定义事件
defineEmits<{
  (e: "reply", comment: Comment): void;
}>();

// 引用DOM元素
const commentContentRef = ref<HTMLElement | null>(null);

// 监听内容变化并应用代码高亮
watch(
  () => props.comment.content,
  () => {
    nextTick(() => {
      highlightCodeBlocks();
    });
  },
);

// 组件挂载后应用代码高亮
onMounted(() => {
  nextTick(() => {
    highlightCodeBlocks();
  });
});

// 获取名称首字母作为头像
const getInitials = (name: string): string => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

// 确保网站链接有http前缀
const ensureHttpPrefix = (url: string): string => {
  if (!url) return "#";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

// 格式化日期
const formatDate = (timestamp: number | string): string => {
  if (!timestamp) return "";
  try {
    // 处理ISO 8601格式的日期字符串 (2025-07-23T10:32:59.000Z)
    const date =
      typeof timestamp === "string"
        ? new Date(timestamp)
        : new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    // 如果是今天内的评论，显示相对时间
    if (diffDay < 1) {
      if (diffHour < 1) {
        if (diffMin < 1) {
          return "刚刚";
        }
        return `${diffMin}分钟前`;
      }
      return `${diffHour}小时前`;
    }

    // 如果是一周内的评论，显示天数
    if (diffDay < 7) {
      return `${diffDay}天前`;
    }

    // 否则显示完整日期
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (err) {
    console.error("日期格式化失败:", err);
    return "未知时间";
  }
};

// 高亮代码块
const highlightCodeBlocks = () => {
  if (!commentContentRef.value) return;

  // 查找所有代码块
  const codeBlocks = commentContentRef.value.querySelectorAll("pre code");

  // 为每个代码块应用高亮
  codeBlocks.forEach((codeBlock) => {
    // 添加行号类
    const preElement = codeBlock.parentElement;
    if (!preElement) return;

    // 确保添加行号类
    if (!preElement.classList.contains("line-numbers")) {
      preElement.classList.add("line-numbers");
    }

    // 检查是否已经有包装器
    const existingWrapper = preElement.closest(".code-block-wrapper");

    // 如果已经有包装器，只需要更新暗色模式类
    if (existingWrapper) {
      const isDarkMode = document.documentElement.classList.contains("dark");
      if (isDarkMode) {
        existingWrapper.classList.add("dark-theme");
        existingWrapper
          .querySelector(".code-header")
          ?.classList.add("dark-theme");
      } else {
        existingWrapper.classList.remove("dark-theme");
        existingWrapper
          .querySelector(".code-header")
          ?.classList.remove("dark-theme");
      }

      // 重新应用Prism高亮
      Prism.highlightElement(codeBlock);

      // 确保行号正确显示
      setTimeout(() => {
        if (
          Prism.plugins.lineNumbers &&
          typeof Prism.plugins.lineNumbers.resize === "function"
        ) {
          Prism.plugins.lineNumbers.resize(preElement);
        }
      }, 100);

      return;
    }

    // 获取语言类
    const classNames = codeBlock.className.split(" ");
    let language = "javascript"; // 默认语言

    for (const className of classNames) {
      if (className.startsWith("language-")) {
        language = className.replace("language-", "");
        break;
      }
    }

    // 创建macOS风格的代码块头部
    const codeBlockWrapper = document.createElement("div");
    codeBlockWrapper.className = "code-block-wrapper";

    const codeHeader = document.createElement("div");
    codeHeader.className = "code-header";

    // 添加红、黄、绿三个点
    const dots = document.createElement("div");
    dots.className = "dots";

    const redDot = document.createElement("div");
    redDot.className = "dot red";

    const yellowDot = document.createElement("div");
    yellowDot.className = "dot yellow";

    const greenDot = document.createElement("div");
    greenDot.className = "dot green";

    dots.appendChild(redDot);
    dots.appendChild(yellowDot);
    dots.appendChild(greenDot);

    // 添加语言标签
    const languageTag = document.createElement("div");
    languageTag.className = "language";
    languageTag.textContent = language;

    // 添加复制按钮
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.innerHTML = '<i class="pi pi-copy"></i> 复制';
    copyBtn.onclick = (e) => {
      e.preventDefault();
      const code = codeBlock.textContent || "";
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerHTML = '<i class="pi pi-check"></i> 已复制';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="pi pi-copy"></i> 复制';
        }, 2000);
      });
    };

    codeHeader.appendChild(dots);
    codeHeader.appendChild(languageTag);
    codeHeader.appendChild(copyBtn);

    // 将原始代码块的父元素替换为包装后的元素
    if (preElement.parentElement) {
      codeBlockWrapper.appendChild(codeHeader);
      preElement.parentElement.insertBefore(codeBlockWrapper, preElement);
      codeBlockWrapper.appendChild(preElement);
    }

    // 检测暗色模式并应用适当的类
    if (document.documentElement.classList.contains("dark")) {
      codeBlockWrapper.classList.add("dark-theme");
      codeHeader.classList.add("dark-theme");
    }

    // 应用Prism高亮
    Prism.highlightElement(codeBlock);

    // 确保行号正确显示
    setTimeout(() => {
      if (
        Prism.plugins.lineNumbers &&
        typeof Prism.plugins.lineNumbers.resize === "function"
      ) {
        Prism.plugins.lineNumbers.resize(preElement);
      }
    }, 100);
  });
};

// 格式化评论内容，支持基本的Markdown语法
const formattedContent = computed(() => {
  if (!props.comment.content) return "";

  try {
    // 使用marked函数，marked返回的是Promise<string>或string，这里我们同步处理
    const html = marked(props.comment.content) as string;

    // 使用DOMPurify清理HTML，防止XSS攻击
    const cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "code",
        "a",
        "ul",
        "ol",
        "li",
        "blockquote",
        "pre",
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class", "language-*"],
    });

    return cleanHtml;
  } catch (err) {
    console.error("评论内容格式化失败:", err);
    return props.comment.content;
  }
});
</script>

<style lang="scss" scoped>
.comment-content {
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  width: 100%;
  overflow-x: auto;

  :deep(p) {
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(a) {
    color: var(--color-primary);

    .dark & {
      color: var(--color-accent-cyan);
    }

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(code) {
    // background-color: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-family: monospace;

    .dark & {
      // background-color: #374151;
    }
  }

  :deep(pre) {
    // background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.375rem;
    overflow-x: auto;
    margin: 1rem 0;
    position: relative;
    max-width: 100%;
    width: 100%;

    /* 移动设备优化 */
    @media (max-width: 768px) {
      width: calc(100% + 2rem);
      border-radius: 0;
    }

    .dark & {
      // background-color: #1f2937;
    }

    code {
      // background-color: transparent;
      padding: 0;
      border-radius: 0;
      font-family: "Fira Code", monospace;
      white-space: pre;
      tab-size: 2;
      font-size: 0.85rem;
      /* 移动设备上稍微减小字体大小 */

      @media (max-width: 768px) {
        font-size: 0.8rem;
      }
    }

    &.line-numbers {
      padding-left: 3.5rem;
      white-space: pre;
      counter-reset: linenumber;

      @media (max-width: 768px) {
        padding-left: 3rem;
      }
    }
  }

  :deep(blockquote) {
    border-left: 4px solid #d1d5db;
    padding-left: 1rem;
    font-style: italic;
    color: #4b5563;
    margin: 0.5rem 0;

    .dark & {
      border-left-color: #4b5563;
      color: #9ca3af;
    }
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.25rem;
    margin: 0.5rem 0;
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(ol) {
    list-style-type: decimal;
  }
}

/* 代码块样式 */
:deep(.code-block-wrapper) {
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #d1d5db;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-width: 100%;
  width: 100%;

  /* 移动设备优化 */

  /* 暗色模式下增强代码块可见性 */
  .dark & {
    border-color: rgba(100, 255, 218, 0.2);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(100, 255, 218, 0.1);
  }

  /* 确保代码头部有圆角 */
  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;

    /* 移动设备优化 */
    @media (max-width: 768px) {
      border-radius: 0;
      padding: 0.5rem;
    }

    .dark & {
      background-color: #1e293b;
      border-color: #334155;
    }

    &.dark-theme {
      background-color: #1e293b;
      border-color: #334155;
    }

    .dots {
      display: flex;
      align-items: center;
      gap: 0.375rem;

      .dot {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;

        &.red {
          background-color: #ef4444;
        }

        &.yellow {
          background-color: #f59e0b;
        }

        &.green {
          background-color: #10b981;
        }
      }
    }

    .language {
      font-size: 0.75rem;
      color: #6b7280;
      font-family: "Fira Code", monospace;
      margin-left: auto;
      margin-right: 1rem;

      .dark & {
        color: #9ca3af;
      }
    }

    .copy-btn {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      /* 移动设备优化 */
      @media (max-width: 768px) {
        min-height: 36px;
        min-width: 44px;
      }

      &:hover {
        background-color: #e5e7eb;
      }

      .dark & {
        background-color: #334155;
        border-color: #475569;
        color: #d1d5db;

        &:hover {
          background-color: #475569;
        }
      }

      i {
        font-size: 0.75rem;
      }
    }
  }

  /* 确保代码块底部有圆角 */
  pre {
    margin: 0 !important;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border: none !important;

    /* 移动设备优化 */
    @media (max-width: 768px) {
      border-radius: 0 !important;
    }
  }

  /* 确保代码内容没有自己的圆角 */
  pre code {
    border-radius: 0;
  }
}

/* 确保Prism样式在评论中也能正常工作 */
.comment-content pre.line-numbers {
  position: relative;
  padding-left: 3.5rem;
  counter-reset: linenumber;
  margin: 0;
  background-color: #f3f4f6;
  overflow-x: auto;
  max-width: 100%;
  width: 100%;
}

.dark .comment-content pre.line-numbers {
  // background-color: #1f2937;
}

.comment-content pre.line-numbers > code {
  position: relative;
  white-space: pre;
  font-family: "Fira Code", monospace;
  tab-size: 2;
}

.comment-content .line-numbers .line-numbers-rows {
  position: absolute;
  pointer-events: none;
  top: 0;
  font-size: 100%;
  left: -3.5rem;
  width: 3rem;
  letter-spacing: -1px;
  border-right: 1px solid #999;
  user-select: none;
  padding-top: 1rem;
  padding-bottom: 1rem;

  @media (max-width: 768px) {
    left: -3rem;
    width: 2.5rem;
    font-size: 90%;
  }
}

.comment-content .line-numbers-rows > span {
  display: block;
  counter-increment: linenumber;
  line-height: inherit;
}

.comment-content .line-numbers-rows > span:before {
  content: counter(linenumber);
  color: #999;
  display: block;
  padding-right: 0.8em;
  text-align: right;
}

/* 暗色模式适配 */
.dark .comment-content .line-numbers-rows {
  border-right-color: #4b5563;
}

.dark .comment-content .line-numbers-rows > span:before {
  color: #6b7280;
}

/* 确保代码和行号对齐 */
.comment-content pre.line-numbers code,
.comment-content pre.line-numbers .line-numbers-rows {
  line-height: 1.5;
}
</style>
