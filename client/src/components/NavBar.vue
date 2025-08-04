<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 dark:bg-bg-dark dark:bg-opacity-90 backdrop-blur-sm shadow-md"
  >
    <div
      class="container mx-auto px-4 flex justify-between items-center h-[56px]"
    >
      <!-- Logo区域 -->
      <router-link to="/" class="flex items-center space-x-2">
        <div
          class="text-primary dark:text-code-accent font-bold text-2xl font-montserrat flex items-center"
        >
          <span class="animate-pulse">Syntax</span>
          <span>Seed</span>
        </div>
      </router-link>
      <div class="flex space-x-4 md:hidden">
        <UserMenu />
        <!-- 移动端菜单按钮 -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="text-gray-700 dark:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="!isMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <!-- 桌面端导航 -->
      <div class="hidden md:flex items-center space-x-8">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="text-gray-700 hover:text-primary dark:hover:text-code-accent transition-colors duration-300 routeLink"
          :class="{ 'text-primary dark:text-code-accent': isActive(item.path) }"
        >
          {{ item.name }}
        </router-link>

        <!-- 用户菜单 -->

        <!-- 主题切换按钮（Switch风格） -->
        <button
          @click="$emit('toggle-theme')"
          class="theme-toggle relative w-12 h-6 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none"
          :class="{ dark: isDarkMode }"
          aria-label="切换主题"
        >
          <!-- 滑块 -->
          <span
            class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300"
            style="z-index: 3"
            :class="isDarkMode ? 'translate-x-6' : 'translate-x-0'"
          >
            <i
              v-if="isDarkMode"
              key="moon"
              class="pi pi-moon text-xs text-primary dark:text-code-accent transition-opacity duration-300"
            ></i>
            <i
              v-else
              key="sun"
              class="pi pi-sun text-xs text-yellow-400 transition-opacity duration-300"
            ></i>
          </span>
        </button>
        <UserMenu />
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition name="list">
      <div
        v-if="isMenuOpen"
        class="md:hidden bg-white dark:bg-gray-800 shadow-md"
      >
        <div class="container mx-auto px-4 py-2 flex flex-col space-y-3">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="py-2 text-gray-700 routeLink hover:text-primary dark:hover:text-code-accent transition-colors duration-300"
            :class="{
              'text-primary dark:text-code-accent': isActive(item.path),
            }"
            @click="isMenuOpen = false"
          >
            {{ item.name }}
          </router-link>

          <!-- 移动端用户菜单 -->
          <!-- <div class="py-2">
            <UserMenu />
          </div> -->

          <!-- 移动端主题切换 -->
          <div class="py-2 flex items-center justify-between">
            <span class="text-gray-700 dark:text-gray-300">切换主题</span>
            <button
              @click="$emit('toggle-theme')"
              class="theme-toggle"
              :class="{ dark: isDarkMode }"
              aria-label="切换主题"
            ></button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import UserMenu from "./UserMenu.vue";

export default {
  name: "NavBar",
  components: {
    UserMenu,
  },
  props: {
    isDarkMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle-theme"],
  setup() {
    const route = useRoute();
    const isMenuOpen = ref(false);

    const navItems = [
      { name: "博客", path: "/blog" },
      { name: "项目集", path: "/projects" },
      { name: "时间轴", path: "/timeline" },
      { name: "技术栈", path: "/tech-stack" },
    ];

    const isActive = (path) => {
      if (path === "/") {
        return route.path === "/";
      }
      return route.path.startsWith(path);
    };

    return {
      isMenuOpen,
      navItems,
      isActive,
    };
  },
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  overflow: hidden;
  height: 264px;
  opacity: 1;
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  transition: all 0.3s ease;
  overflow: hidden;
  height: 0;
  opacity: 0;
}

.dark .routeLink {
  color: #d9d9d9;
}
</style>
