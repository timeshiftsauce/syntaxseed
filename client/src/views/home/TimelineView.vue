<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4">成长时间轴</h1>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          记录我的编程学习历程和技术成长轨迹，从初学者到开发者的点滴进步。
        </p>
      </div>

      <!-- 时间轴组件 -->
      <div class="max-w-4xl mx-auto">
        <Timeline
          v-if="events.length > 0"
          :value="events"
          class="custom-timeline"
          layout="vertical"
          align="alternate"
        >
          <template #content="slotProps">
            <div
              class="card p-5 mb-3 hover:shadow-lg transition-shadow duration-300"
            >
              <div class="flex flex-col md:flex-row md:items-center mb-4">
                <h3
                  class="text-xl font-bold text-primary dark:text-code-accent mb-2 md:mb-0 md:mr-4"
                >
                  {{ slotProps.item.title }}
                </h3>
                <div
                  class="text-sm text-gray-500 dark:text-gray-400 flex items-center"
                >
                  <i class="pi pi-calendar mr-1"></i>
                  {{ slotProps.item.date }}
                </div>
              </div>

              <p class="text-gray-600 dark:text-gray-400 mb-4">
                {{ slotProps.item.description }}
              </p>

              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tech in slotProps.item.technologies"
                  :key="tech"
                  class="tech-badge"
                >
                  {{ tech }}
                </span>
              </div>

              <div
                v-if="slotProps.item.skills && slotProps.item.skills.length > 0"
                class="mt-4"
              >
                <h4
                  class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300"
                >
                  技能提升
                </h4>
                <div
                  v-for="skill in slotProps.item.skills"
                  :key="skill.name"
                  class="mb-2"
                >
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{
                      skill.name
                    }}</span>
                    <span class="text-sm text-gray-600 dark:text-gray-400"
                      >{{ skill.level }}%</span
                    >
                  </div>
                  <ProgressBar
                    :value="skill.level"
                    :showValue="false"
                    class="h-2"
                  />
                </div>
              </div>

              <div
                v-if="slotProps.item.image"
                class="mt-4 rounded-lg overflow-hidden"
              >
                <img
                  :src="baseUrl + slotProps.item.image"
                  :alt="slotProps.item.title"
                  class="w-full h-auto"
                />
              </div>

              <div v-if="slotProps.item.link" class="mt-4">
                <a
                  :href="slotProps.item.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary dark:text-code-accent hover:underline inline-flex items-center"
                >
                  查看相关项目
                  <i class="pi pi-external-link ml-1"></i>
                </a>
              </div>
            </div>
          </template>

          <template #opposite="slotProps">
            <div class="text-center md:text-right">
              <span
                class="box-content p-2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary bg-opacity-20 text-primary dark:bg-opacity-30 dark:text-code-accent font-bold text-lg"
              >
                {{ slotProps.item.year }}
              </span>
            </div>
          </template>

          <template #marker>
            <span
              class="custom-marker flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary dark:border-code-accent bg-white dark:bg-gray-800 shadow-md z-10"
            ></span>
          </template>

          <template #connector>
            <div
              class="custom-connector w-0.5 bg-primary bg-opacity-30 dark:bg-opacity-30"
            ></div>
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import useConfig from "../../stores/config.js";
import { getTimelines } from "../../api/index.js";
import { storeToRefs } from "pinia";
export default {
  name: "TimelineView",
  setup() {
    const events = ref([]);
    const config = useConfig();

    const { ossBaseUrl } = storeToRefs(config);
    const baseUrl = ossBaseUrl;
    getTimelines().then((response) => {
      events.value = response?.data ?? "";
    });

    return {
      events,
      baseUrl,
    };
  },
};
</script>

<style scoped lang="scss">
/* 自定义Timeline样式 */
.custom-timeline :deep(.p-timeline-event-opposite) {
  @apply flex items-center justify-end;
}

.custom-timeline :deep(.p-timeline-event-content) {
  @apply pb-8;
}

.custom-timeline :deep(.p-timeline-event-separator) {
  @apply flex-col;
}

.custom-timeline :deep(.custom-marker) {
  @apply transition-all duration-300;
}

.custom-timeline :deep(.p-timeline-event:hover .custom-marker) {
  @apply bg-primary dark:bg-code-accent scale-125;
}

.custom-timeline :deep(.custom-connector) {
  @apply flex-grow;
}

:deep(
    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even)
  )
  .p-timeline-event-opposite {
  justify-content: flex-start;
}
</style>
