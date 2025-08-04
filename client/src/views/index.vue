<template>
  <div class="min-h-screen flex flex-col">
    <NavBar
      @toggle-theme="useTheme.toggleTheme"
      :isDarkMode="useTheme.isDarkMode"
    />
    <main class="flex-grow">
      <!-- 添加顶部内边距，为固定导航栏腾出空间 -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import theme from "@/stores/theme.ts";
const useTheme = theme();
</script>

<style scoped>
main {
  margin-top: 56px;
}
</style>
