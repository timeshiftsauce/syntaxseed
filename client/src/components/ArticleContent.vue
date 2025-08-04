<template>
  <div
    class="article-content prose prose-lg dark:prose-invert max-w-none mb-12"
  >
    <!-- 文章内容 -->
    <div
      ref="contentRef"
      v-html="processedContent"
      class="dark:text-gray-200"
    ></div>

    <!-- 图片查看器 -->
    <div v-if="showImageViewer" class="image-viewer" @click="closeImageViewer">
      <div class="image-viewer-content" @click.stop>
        <img :src="currentImage" alt="放大查看" />
        <button class="close-button" @click="closeImageViewer">
          <i class="pi pi-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import Prism from "prismjs";
import { marked } from "marked";
import DOMPurify from "dompurify";
// 导入自定义主题
import "../assets/prism-custom-theme.css";
// 导入暗色模式主题
import "../assets/prism-dark-theme.css";

// 定义props
interface Props {
  content: string;
}

const props = defineProps<Props>();

// 图片查看器状态
const showImageViewer = ref(false);
const currentImage = ref("");
const contentRef = ref<HTMLElement | null>(null);

// 处理内容，将Markdown转为HTML并净化
const processedContent = computed(() => {
  if (!props.content) return "";
  // 使用 marked 将 Markdown 转换为 HTML
  const rawHtml = marked(props.content) as string;
  // 使用 DOMPurify 净化 HTML 内容，防止 XSS 攻击
  return DOMPurify.sanitize(rawHtml);
});

// 高亮代码块
const highlightCodeBlocks = () => {
  if (!contentRef.value) return;

  // 查找所有代码块
  const codeBlocks = contentRef.value.querySelectorAll("pre code");

  // 为每个代码块添加行号类和包装器
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

    // 如果没有语言类，添加默认语言类
    if (!codeBlock.classList.contains(`language-${language}`)) {
      codeBlock.classList.add(`language-${language}`);
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

// 添加图片点击事件
const setupImageClickHandlers = () => {
  if (!contentRef.value) return;

  const images = contentRef.value.querySelectorAll("img");
  images.forEach((img) => {
    // 添加鼠标样式和过渡效果
    img.style.cursor = "zoom-in";
    img.style.transition = "transform 0.3s ease";

    // 添加悬停效果
    img.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.02)";
    });

    img.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)";
    });

    // 添加点击事件
    img.addEventListener("click", (e) => {
      e.preventDefault();
      currentImage.value = img.src;
      showImageViewer.value = true;

      // 禁用页面滚动
      document.body.style.overflow = "hidden";
    });
  });
};

// 关闭图片查看器
const closeImageViewer = () => {
  showImageViewer.value = false;
  // 恢复页面滚动
  document.body.style.overflow = "";
};

// 监听内容变化
watch(
  () => processedContent.value,
  async () => {
    await nextTick();
    highlightCodeBlocks();
    setupImageClickHandlers();
  },
);

// 监听暗色模式变化
const setupDarkModeObserver = () => {
  // 创建一个MutationObserver来监听html元素的class变化
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        // 检查是否是暗色模式切换
        const isDarkMode = document.documentElement.classList.contains("dark");

        // 更新代码块样式
        if (contentRef.value) {
          // 查找所有代码块
          const codeBlocks = contentRef.value.querySelectorAll("pre code");

          // 更新每个代码块的样式和行号
          codeBlocks.forEach((codeBlock) => {
            // 确保代码块有行号类
            const preElement = codeBlock.parentElement;
            if (preElement) {
              preElement.classList.add("line-numbers");

              // 查找包装器
              const wrapper = preElement.closest(".code-block-wrapper");
              if (wrapper) {
                // 更新包装器样式
                if (isDarkMode) {
                  wrapper.classList.add("dark-theme");
                  wrapper
                    .querySelector(".code-header")
                    ?.classList.add("dark-theme");
                } else {
                  wrapper.classList.remove("dark-theme");
                  wrapper
                    .querySelector(".code-header")
                    ?.classList.remove("dark-theme");
                }
              }

              // 重新应用Prism高亮和行号
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
            }
          });
        }
      }
    });
  });

  // 开始观察html元素的class属性变化
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // 返回清理函数
  return () => observer.disconnect();
};

// 组件挂载后处理代码块和图片
onMounted(async () => {
  await nextTick();
  highlightCodeBlocks();
  setupImageClickHandlers();

  // 确保行号正确显示
  setTimeout(() => {
    if (contentRef.value) {
      const preElements = contentRef.value.querySelectorAll("pre.line-numbers");
      preElements.forEach((pre) => {
        if (
          Prism.plugins.lineNumbers &&
          typeof Prism.plugins.lineNumbers.resize === "function"
        ) {
          Prism.plugins.lineNumbers.resize(pre);
        }
      });
    }
  }, 200);

  // 设置暗色模式观察器
  const cleanup = setupDarkModeObserver();

  // 组件卸载时清理观察器
  onUnmounted(cleanup);
});
</script>

<style lang="scss" scoped>
.article-content {
  position: relative;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    @apply text-gray-900 dark:text-white font-bold mb-4 mt-8;

    /* 暗色模式下增强标题可见性 */
    .dark & {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

  // :deep(p) {
  //   @apply mb-4 leading-relaxed text-gray-800 dark:text-gray-200;
  // }

  // :deep(pre) {
  //   background-color: #1f2937;
  //   overflow-x: auto;
  //   border: 1px solid #374151;
  //   margin: 0;
  //   position: relative;

  //   /* 暗色模式下增强阴影效果 */
  //   .dark & {
  //     background-color: #0f172a;
  //     border-color: #1e293b;
  //     box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  //   }

  //   /* 当在包装器内时，移除边框和外边距 */
  //   .code-block-wrapper & {
  //     border: none;
  //     margin: 0;
  //     border-radius: 0;
  //     border-bottom-left-radius: 0.75rem;
  //     border-bottom-right-radius: 0.75rem;
  //   }

  //   &.line-numbers {
  //     padding-left: 3.5rem;
  //     white-space: pre;
  //     counter-reset: linenumber;
  //   }

  //   code {
  //     white-space: pre;
  //     tab-size: 2;
  //   }
  // }

  // :deep(code) {
  //   @apply text-code-accent font-mono text-sm;

  //   /* 暗色模式下增强代码可见性 */
  //   .dark & {
  //     color: var(--color-accent-cyan);
  //     text-shadow: 0 0 2px rgba(100, 255, 218, 0.2);
  //   }
  // }

  :deep(blockquote) {
    @apply border-l-4 border-primary dark:border-code-accent pl-4 italic;
    @apply bg-gray-50 dark:bg-gray-800/50 p-4 rounded-r-lg;

    /* 暗色模式下增强引用块可见性 */
    .dark & {
      background: rgba(26, 32, 44, 0.6);
      border-left-width: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
  }

  :deep(img) {
    @apply rounded-lg shadow-lg max-w-full h-auto;
    @apply transition-all duration-300;
    display: block;
    margin: 1.5rem auto;

    /* 暗色模式下优化图片边框 */
    .dark & {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(100, 255, 218, 0.1);
    }
  }

  :deep(ul),
  :deep(ol) {
    @apply pl-6 mb-4 text-gray-800 dark:text-gray-200;
  }

  :deep(li) {
    @apply mb-2;

    /* 暗色模式下增强列表项可见性 */
    .dark & {
      &::marker {
        color: var(--color-accent-cyan);
      }
    }
  }

  :deep(a) {
    @apply text-primary dark:text-code-accent;
    @apply transition-all duration-300;
    @apply hover:underline;

    /* 暗色模式下增强链接可见性 */
    .dark & {
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;

      &:hover {
        text-shadow: 0 0 8px rgba(100, 255, 218, 0.5);
      }
    }
  }

  :deep(table) {
    @apply w-full border-collapse mb-4;

    /* 暗色模式下增强表格可见性 */
    .dark & {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }

  :deep(th),
  :deep(td) {
    @apply border border-gray-300 dark:border-gray-700 p-2;

    /* 暗色模式下增强表格单元格可见性 */
    .dark & {
      border-color: rgba(100, 255, 218, 0.2);
    }
  }

  :deep(th) {
    @apply bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white;

    /* 暗色模式下增强表头可见性 */
    .dark & {
      background: rgba(26, 32, 44, 0.8);
    }
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

  /* 暗色模式下增强代码块可见性 */
  .dark & {
    border-color: rgba(100, 255, 218, 0.2);
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(100, 255, 218, 0.1);
  }

  /* 确保代码头部有圆角 */
  .code-header {
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
  }

  /* 确保代码块底部有圆角 */
  pre {
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }

  /* 确保代码内容没有自己的圆角 */
  pre code {
    border-radius: 0;
  }
}

/* 图片查看器样式 */
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  /* 暗色模式下优化背景 */
  .dark & {
    background-color: rgba(10, 25, 47, 0.95);
  }
}

.image-viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  animation: zoomIn 0.3s ease;

  img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);

    /* 暗色模式下优化图片边框 */
    .dark & {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(100, 255, 218, 0.2);
    }
  }
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  /* 暗色模式下优化关闭按钮 */
  .dark & {
    color: var(--color-accent-cyan);

    &:hover {
      background-color: rgba(100, 255, 218, 0.2);
      box-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
    }
  }
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式优化 */
// @media (max-width: 768px) {
//   .image-viewer-content {
//     max-width: 95%;
//   }

//   .close-button {
//     top: -30px;
//     font-size: 20px;
//     padding: 10px;
//     /* 增大触摸目标 */
//   }

//   // :deep(pre) {
//   //   @apply mx-0 -mx-4 sm:mx-0 rounded-none sm:rounded-xl;
//   //   width: calc(100% + 2rem);
//   //   margin-left: -1rem;
//   //   margin-right: -1rem;
//   // }

//   :deep(.code-block-wrapper) {
//     @apply mx-0 -mx-4 sm:mx-0 rounded-none sm:rounded-xl;
//     width: calc(100% + 2rem);
//     margin-left: -1rem;
//     margin-right: -1rem;
//   }

//   :deep(.code-header) {
//     @apply px-3 py-2;
//     border-radius: 0;
//   }

//   :deep(.copy-btn) {
//     @apply px-3 py-1.5;
//     /* 增大触摸目标 */
//     min-height: 36px;
//     min-width: 44px;
//   }

//   :deep(img) {
//     @apply my-4;
//     max-width: 100%;
//     height: auto;
//   }
// }

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .image-viewer,
  .image-viewer-content,
  :deep(img),
  .close-button {
    animation: none;
    transition: none;
  }

  :deep(img):hover {
    transform: none;
  }

  .close-button:hover {
    transform: none;
  }
}
</style>
