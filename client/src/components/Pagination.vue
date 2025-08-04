<template>
  <div class="pagination flex items-center justify-center space-x-2 my-6">
    <!-- 上一页按钮 -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-btn flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
      :class="{
        'bg-gray-100 text-gray-400 cursor-not-allowed':
          currentPage === 1 && !isDark,
        'bg-dark-700 text-gray-500 cursor-not-allowed':
          currentPage === 1 && isDark,
        'bg-primary/10 text-primary hover:bg-primary hover:text-white':
          currentPage !== 1 && !isDark,
        'bg-dark-800 text-secondary hover:bg-secondary hover:text-dark':
          currentPage !== 1 && isDark,
      }"
    >
      <i class="pi pi-chevron-left"></i>
    </button>

    <!-- 页码按钮 -->
    <template v-for="page in displayedPages" :key="page">
      <button
        v-if="page !== '...'"
        @click="changePage(page)"
        class="pagination-btn flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
        :class="{
          'bg-primary text-white': currentPage === page,
          'bg-primary/10 text-primary hover:bg-primary hover:text-white':
            currentPage !== page && !isDark,
          'bg-dark-800 text-secondary hover:bg-secondary hover:text-dark':
            currentPage !== page && isDark,
        }"
      >
        {{ page }}
      </button>
      <span
        v-else
        class="flex items-center justify-center w-10 h-10 text-gray-500"
      >
        ...
      </span>
    </template>

    <!-- 下一页按钮 -->
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-btn flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
      :class="{
        'bg-gray-100 text-gray-400 cursor-not-allowed':
          currentPage === totalPages && !isDark,
        'bg-dark-700 text-gray-500 cursor-not-allowed':
          currentPage === totalPages && isDark,
        'bg-primary/10 text-primary hover:bg-primary hover:text-white':
          currentPage !== totalPages && !isDark,
        'bg-dark-800 text-secondary hover:bg-secondary hover:text-dark':
          currentPage !== totalPages && isDark,
      }"
    >
      <i class="pi pi-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["page-change"]);

// 计算要显示的页码
const displayedPages = computed(() => {
  if (props.totalPages <= props.maxVisiblePages) {
    // 如果总页数小于等于最大可见页数，显示所有页码
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }

  // 否则，显示部分页码，并在中间使用省略号
  const pages = [];
  const halfVisiblePages = Math.floor(props.maxVisiblePages / 2);

  // 始终显示第一页
  pages.push(1);

  // 当前页靠近开始
  if (props.currentPage <= halfVisiblePages + 1) {
    for (let i = 2; i <= props.maxVisiblePages - 1; i++) {
      pages.push(i);
    }
    pages.push("...");
  }
  // 当前页靠近结束
  else if (props.currentPage >= props.totalPages - halfVisiblePages) {
    pages.push("...");
    for (
      let i = props.totalPages - props.maxVisiblePages + 2;
      i < props.totalPages;
      i++
    ) {
      pages.push(i);
    }
  }
  // 当前页在中间
  else {
    pages.push("...");
    for (
      let i = props.currentPage - Math.floor(halfVisiblePages / 2);
      i <= props.currentPage + Math.floor(halfVisiblePages / 2);
      i++
    ) {
      pages.push(i);
    }
    pages.push("...");
  }

  // 始终显示最后一页
  pages.push(props.totalPages);

  return pages;
});

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) {
    return;
  }

  emit("page-change", page);
};
</script>

<style scoped>
.pagination-btn {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.pagination-btn:hover:not(:disabled) {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
