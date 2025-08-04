<template>
  <div class="comment-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-8">
      <div class="loading-spinner mb-3"></div>
      <span class="text-gray-600 dark:text-gray-400">加载评论中...</span>
    </div>

    <!-- 错误状态 -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 rounded-lg p-5 my-4 border border-red-100 dark:border-red-800/30"
    >
      <div class="flex items-center">
        <i
          class="pi pi-exclamation-circle text-red-500 dark:text-red-400 mr-2 text-lg"
        ></i>
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
      </div>
      <button
        @click="fetchComments"
        class="mt-3 text-sm bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-full flex items-center w-fit transition-colors"
      >
        <i class="pi pi-refresh mr-1"></i> 重试加载
      </button>
    </div>

    <!-- 无评论状态 -->
    <div v-else-if="rootComments.length === 0" class="text-center py-8">
      <div
        class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"
      >
        <i class="pi pi-comments text-3xl text-gray-400 dark:text-gray-500"></i>
      </div>
      <p class="text-gray-600 dark:text-gray-400 mb-2">暂无评论</p>
      <p class="text-sm text-gray-500 dark:text-gray-500">
        来发表第一条评论吧！
      </p>
    </div>

    <!-- 评论列表 -->
    <div v-else class="space-y-6">
      <!-- 根评论 -->
      <div
        v-for="comment in rootComments"
        :key="comment.id"
        class="comment-item"
      >
        <CommentCard :comment="comment" :level="0" @reply="handleReply" />

        <!-- 一级回复 -->
        <div
          v-if="getCommentReplies(comment.id).length > 0"
          class="ml-6 mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-4"
        >
          <div v-for="reply in getCommentReplies(comment.id)" :key="reply.id">
            <CommentCard :comment="reply" :level="1" @reply="handleReply" />

            <!-- 二级回复 -->
            <div
              v-if="getCommentReplies(reply.id).length > 0"
              class="ml-5 mt-3 pl-4 border-l-2 border-gray-200/70 dark:border-gray-700/70 space-y-3"
            >
              <CommentCard
                v-for="nestedReply in getCommentReplies(reply.id)"
                :key="nestedReply.id"
                :comment="nestedReply"
                :level="2"
                @reply="handleReply"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="flex justify-center mt-8">
      <Paginator
        v-model:first="first"
        :rows="limit"
        :totalRecords="total"
        @page="onPageChange"
        :alwaysShow="true"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-2 shadow-sm"
      >
      </Paginator>
    </div>

    <!-- 评论数量统计 -->
    <div
      v-if="total > 0"
      class="text-center mt-4 text-sm text-gray-500 dark:text-gray-400"
    >
      共 {{ total }} 条评论
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { getComments } from "../api/comments";
import CommentCard from "./CommentCard.vue";
import Paginator from "primevue/paginator"; // 导入Paginator组件

// 导入评论数据类型
import type { Comment } from "../api/comments";

// 导入API响应类型
import type { CommentsResponse } from "../api/comments";

// 定义组件属性
const props = defineProps<{
  blogId: string | number;
  limit?: number;
}>();

// 定义事件
const emit = defineEmits<{
  (e: "reply", comment: Comment): void;
}>();

// 响应式状态
const comments = ref<Comment[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const page = ref(1);
const first = ref(0);
const total = ref(0);
const limit = ref(props.limit || 10);

// 调试用：监视分页相关状态变化

// 根评论（没有父评论的评论）
const rootComments = computed(() => {
  return comments.value.filter((comment) => !comment.parent_id);
});

// 获取特定评论的回复
const getCommentReplies = (parentId: string | number) => {
  return comments.value.filter((comment) => comment.parent_id === parentId);
};

// 获取评论列表
const fetchComments = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = (await getComments(
      props.blogId,
      {
        page: page.value,
        limit: limit.value,
      },
      false,
    )) as CommentsResponse;

    if (response && response.data) {
      // 直接使用扁平结构的评论数据
      comments.value = response.data;
      total.value = response.total || response.data.length;

      // 确保分页状态与API返回一致
      if (response.page) {
        page.value = response.page;
        first.value = (response.page - 1) * (response.limit || limit.value);
      }

      // 强制更新total值，确保分页组件能够正确显示
      if (typeof response.total === "number") {
        total.value = Math.max(response.total, 1); // 确保至少有1条记录，避免分页组件不显示
      }
    } else {
      comments.value = [];
      total.value = 0;
    }
  } catch (err: unknown) {
    console.error("获取评论失败:", err);
    error.value =
      (err as { message?: string })?.message || "获取评论失败，请稍后重试";
    comments.value = [];
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const onPageChange = (event: { page: number; first: number }) => {
  // PrimeVue的Paginator组件的页码是从0开始的，而我们的API是从1开始
  // 所以需要+1转换为API所需的页码
  page.value = event.page + 1;
  first.value = event.first;
  fetchComments();
};

// 处理回复事件
const handleReply = (comment: Comment) => {
  emit("reply", comment);
};

// 监听博客ID变化
watch(
  () => props.blogId,
  (newId) => {
    if (newId) {
      // 重置分页状态
      page.value = 1;
      first.value = 0;
      fetchComments();
    }
  },
  { immediate: false },
);

// 监听limit变化
watch(
  () => props.limit,
  (newLimit) => {
    if (newLimit && newLimit !== limit.value) {
      limit.value = newLimit;
      // 重置分页状态
      page.value = 1;
      first.value = 0;
      fetchComments();
    }
  },
  { immediate: false },
);

// 组件挂载时获取评论
onMounted(() => {
  if (props.blogId) {
    fetchComments();
  }
});

// 暴露方法给父组件
defineExpose({
  fetchComments,
});
</script>

<style lang="scss" scoped>
.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #e5e7eb;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  .dark & {
    border-color: #374151;
    border-top-color: var(--color-accent-cyan);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 减少动画效果的媒体查询支持 */
@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
}
</style>
