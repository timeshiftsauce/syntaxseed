<template>
  <div class="user-menu">
    <!-- 未登录状态 -->
    <Avatar
      v-if="!userStore.isLoggedIn"
      label="登录"
      size="normal"
      shape="circle"
      class="Avatar cursor-pointer hover:ring-2 hover:ring-primary dark:hover:ring-code-accent transition-all duration-300 user-avatar-char"
      @click="goLogin()"
    />
    <div v-else class="user-info">
      <!-- 用户头像/字符 -->
      <div class="relative flex justify-center">
        <Avatar
          v-if="userStore.userInfo?.avatar"
          :image="userStore.userInfo.avatar"
          size="normal"
          shape="circle"
          class="Avatar cursor-pointer hover:ring-2 hover:ring-primary dark:hover:ring-code-accent transition-all duration-300"
          @click="toggleUserMenu"
        />
        <Avatar
          v-else
          :label="userStore.avatarChar"
          size="normal"
          shape="circle"
          class="Avatar cursor-pointer hover:ring-2 hover:ring-primary dark:hover:ring-code-accent transition-all duration-300 user-avatar-char"
          @click="toggleUserMenu"
        />

        <!-- 在线状态指示器 -->
        <!--        <div-->
        <!--          class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800">-->
        <!--        </div>-->
      </div>

      <!-- 用户下拉菜单 -->
      <Menu
        ref="userMenuRef"
        :model="userMenuItems"
        :popup="true"
        class="user-dropdown-menu"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userAuth.js";
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
// Composables
const userStore = useUserStore();
const toast = useToast();

const userMenuRef = ref();

// 用户菜单项
const userMenuItems = computed(() => [
  {
    label: userStore.displayName,
    disabled: true,
    class: "user-info-item",
  },
  {
    separator: true,
  },
  {
    label: "个人资料",
    icon: "pi pi-user",
    command: () => {
      // TODO: 跳转到个人资料页面
      toast.add({
        severity: "info",
        summary: "功能开发中",
        detail: "个人资料功能正在开发中",
        life: 3000,
      });
    },
  },
  {
    label: "设置",
    icon: "pi pi-cog",
    command: () => {
      // TODO: 跳转到设置页面
      toast.add({
        severity: "info",
        summary: "功能开发中",
        detail: "设置功能正在开发中",
        life: 3000,
      });
    },
  },
  {
    separator: true,
  },
  {
    label: "退出登录",
    icon: "pi pi-sign-out",
    command: handleLogout,
  },
]);

// 方法
const toggleUserMenu = (event) => {
  userMenuRef.value.toggle(event);
};
const goLogin = () => {
  router.push({
    name: "login",
    query: {
      redirect: route.path,
    },
  });
};

const handleLogout = () => {
  userStore.logout();
};
</script>

<style lang="scss" scoped>
.Avatar {
  font-size: 14px;
  width: 40px;
  height: 40px;
}

.user-menu {
  display: flex;
  align-items: center;
}

.login-btn {
  :deep(.p-button) {
    border-color: var(--color-accent-teal);
    color: var(--color-accent-teal);

    &:hover {
      background-color: var(--color-accent-teal);
      border-color: var(--color-accent-teal);
      color: white;
    }

    .dark & {
      border-color: var(--color-accent-cyan);

      &:hover {
        background-color: var(--color-accent-cyan);
        border-color: var(--color-accent-cyan);
        color: var(--color-primary-dark);
      }
    }
  }
}
</style>
