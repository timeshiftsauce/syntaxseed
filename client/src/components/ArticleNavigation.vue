<template>
  <nav
    class="article-navigation mt-8 sm:mt-10 lg:mt-12 border-t border-gray-200 dark:border-gray-700 pt-6"
  >
    <div class="flex flex-col sm:flex-row justify-between gap-4">
      <!-- 上一篇文章 -->
      <div class="w-full sm:w-1/2 sm:pr-2">
        <router-link
          v-if="prevPost"
          :to="{ name: 'blog-detail', params: { id: prevPost.id } }"
          class="nav-link prev-link"
        >
          <div class="flex items-center">
            <div class="nav-icon-container">
              <i
                class="pi pi-arrow-left text-primary dark:text-code-accent"
              ></i>
            </div>
            <span class="nav-text">上一篇</span>
          </div>
          <div class="nav-preview">
            {{ prevPost.title }}
          </div>
        </router-link>
        <div v-else class="nav-link disabled">
          <div class="flex items-center">
            <div class="nav-icon-container disabled">
              <i class="pi pi-arrow-left"></i>
            </div>
            <span class="nav-text">没有上一篇</span>
          </div>
        </div>
      </div>

      <!-- 下一篇文章 -->
      <div class="w-full sm:w-1/2 sm:pl-2 text-right">
        <router-link
          v-if="nextPost"
          :to="{ name: 'blog-detail', params: { id: nextPost.id } }"
          class="nav-link next-link"
        >
          <div class="flex items-center justify-end">
            <span class="nav-text">下一篇</span>
            <div class="nav-icon-container">
              <i
                class="pi pi-arrow-right text-primary dark:text-code-accent"
              ></i>
            </div>
          </div>
          <div class="nav-preview">
            {{ nextPost.title }}
          </div>
        </router-link>
        <div v-else class="nav-link disabled">
          <div class="flex items-center justify-end">
            <span class="nav-text">没有下一篇</span>
            <div class="nav-icon-container disabled">
              <i class="pi pi-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 不再需要导入ref

// 定义组件属性
interface Post {
  id: string | number;
  title: string;
}

// 定义props
const props = defineProps<{
  prevPost?: Post | null;
  nextPost?: Post | null;
}>();

// 不再需要悬停预览状态
</script>

<style lang="scss" scoped>
.article-navigation {
  position: relative;
}

.nav-link {
  display: block;
  padding: 1.25rem;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(
    135deg,
    rgba(var(--color-primary-rgb), 0.03),
    rgba(var(--color-accent-cyan-rgb), 0.05)
  );
  border: 1px solid rgba(var(--color-primary-rgb), 0.1);
  backdrop-filter: blur(8px);

  &:hover,
  &:focus {
    background: linear-gradient(
      135deg,
      rgba(var(--color-primary-rgb), 0.07),
      rgba(var(--color-accent-cyan-rgb), 0.09)
    );
    border-color: rgba(var(--color-primary-rgb), 0.25);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  &:focus {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(var(--color-primary-rgb), 0.2),
      0 8px 20px rgba(0, 0, 0, 0.08);
  }

  &.disabled {
    cursor: not-allowed;
    background: rgba(var(--color-gray-rgb), 0.05);
    border-color: rgba(var(--color-gray-rgb), 0.1);
    transform: none;
    box-shadow: none;
    opacity: 0.7;
  }

  .nav-text {
    font-weight: 600;
    font-size: 1rem;
    color: var(--color-text);
    transition: all 0.3s ease;
  }

  .nav-preview {
    margin-top: 0.75rem;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.5;
    position: relative;
    padding-left: 0.5rem;
    border-left: 2px solid rgba(var(--color-accent-cyan-rgb), 0.5);
  }

  .nav-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: rgba(var(--color-primary-rgb), 0.08);
    margin-right: 0.75rem;
    transition: all 0.3s ease;

    &.disabled {
      background: rgba(var(--color-gray-rgb), 0.1);
    }

    i {
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
  }

  &:hover .nav-icon-container,
  &:focus .nav-icon-container {
    background: rgba(var(--color-primary-rgb), 0.15);
    transform: scale(1.1);
  }

  &.next-link {
    .nav-icon-container {
      margin-right: 0;
      margin-left: 0.75rem;
    }

    .nav-preview {
      border-left: none;
      border-right: 2px solid rgba(var(--color-accent-cyan-rgb), 0.5);
      padding-left: 0;
      padding-right: 0.5rem;
      text-align: right;
    }
  }
}

/* 不再需要过渡动画 */

/* 响应式优化 */
@media (max-width: 640px) {
  .nav-link {
    padding: 1rem;
  }

  .nav-icon-container {
    width: 1.75rem !important;
    height: 1.75rem !important;
  }

  .nav-text {
    font-size: 0.9rem !important;
  }

  .nav-preview {
    font-size: 0.8rem !important;
    margin-top: 0.5rem !important;
  }

  .article-navigation::before {
    width: 2rem;
  }
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .nav-link,
  .nav-link::after,
  .nav-icon-container,
  .nav-text {
    transition: none !important;
  }

  .nav-link:hover,
  .nav-link:focus {
    transform: none !important;
  }

  .nav-link:hover .nav-icon-container,
  .nav-link:focus .nav-icon-container {
    transform: none !important;
  }

  /* 不再需要过渡动画相关代码 */
}

/* 暗色模式适配 */
:root {
  --color-primary-rgb: 0, 102, 255;
  --color-accent-cyan-rgb: 100, 255, 218;
  --color-gray-rgb: 156, 163, 175;
  --color-text: #1f2937;
  --color-text-secondary: #4b5563;
}

.dark {
  --color-primary-rgb: 10, 25, 47;
  --color-accent-cyan-rgb: 100, 255, 218;
  --color-gray-rgb: 75, 85, 99;
  --color-text: #f3f4f6;
  --color-text-secondary: #d1d5db;
}

/* 添加装饰元素 */
.article-navigation::before {
  content: "";
  position: absolute;
  top: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 3rem;
  height: 3px;
  background: linear-gradient(
    to right,
    rgba(var(--color-primary-rgb), 0.5),
    rgba(var(--color-accent-cyan-rgb), 0.5)
  );
  border-radius: 3px;
}

/* 添加悬停时的装饰效果 */
.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    to right,
    rgba(var(--color-primary-rgb), 0.5),
    rgba(var(--color-accent-cyan-rgb), 0.5)
  );
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
  border-radius: 3px;
}

.nav-link:hover::after,
.nav-link:focus::after {
  transform: scaleX(1);
}

.nav-link.next-link::after {
  transform-origin: right;
}

.nav-link.disabled::after {
  display: none;
}
</style>
