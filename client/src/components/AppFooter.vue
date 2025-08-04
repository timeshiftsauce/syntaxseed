<template>
  <footer class="bg-gray-100 dark:bg-gray-900 py-8 mt-12">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- 左侧版权信息 -->
        <div class="mb-4 md:mb-0">
          <div
            class="text-primary dark:text-code-accent font-bold text-xl font-montserrat mb-2"
          >
            SyntaxSeed
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            © {{ currentYear }} 开发者成长日志 | 技术分析博客
          </p>
        </div>

        <!-- 中间导航链接 -->
        <div class="hidden md:flex space-x-6 text-sm">
          <router-link
            v-for="item in footerLinks"
            :key="item.path"
            :to="item.path"
            class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-code-accent transition-colors duration-300"
          >
            {{ item.name }}
          </router-link>
        </div>
        <!-- 右侧社交媒体图标 -->
        <div class="flex space-x-4">
          <a
            v-for="social in config.links"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-code-accent transition-colors duration-300"
            :aria-label="social.name"
            v-tooltip="'访问 ' + social.name"
          >
            <i :class="social.icon" class="text-xl"></i>
          </a>
        </div>
      </div>

      <!-- 移动端导航链接 -->
      <div class="md:hidden flex flex-wrap justify-center gap-4 mt-6 text-sm">
        <router-link
          v-for="item in footerLinks"
          :key="item.path"
          :to="item.path"
          class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-code-accent transition-colors duration-300"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- 底部信息 -->
      <div class="text-center text-xs text-gray-500 dark:text-gray-500 mt-8">
        使用 Vue3 + Tailwind CSS + PrimeVue 构建
        <!-- 备案信息 -->
        <div>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            title="网站ICP备案"
          >
            {{ record_number }}
          </a>
          <a
            class="ml-2"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35020602002570"
            target="_blank"
            rel="noopener noreferrer"
            title="网站公安备案"
          >
            <img
              src="https://img.alicdn.com/tfs/TB1..50QpXXXXX7XpXXXXXXXXXX-40-40.png"
              alt="anbei"
              style="width: 15px; height: 15px; display: inline-block"
            />
            闽公网安备35020602002570号
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed, ref, watch } from "vue";
import useConfig from "../stores/config";

export default {
  name: "AppFooter",
  setup() {
    const config = useConfig();

    const currentYear = computed(() => new Date().getFullYear());
    const record_number = computed(() => config.config.record_number);

    const footerLinks = [
      { name: "首页", path: "/" },
      { name: "博客", path: "/blog" },
      { name: "项目集", path: "/projects" },
      { name: "时间轴", path: "/timeline" },
      { name: "技术栈", path: "/tech-stack" },
    ];
    return {
      currentYear,
      footerLinks,
      record_number,
      config,
    };
  },
};
</script>
