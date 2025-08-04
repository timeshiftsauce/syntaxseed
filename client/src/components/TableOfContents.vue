<template>
  <div
    class="table-of-contents sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto p-4 rounded-lg transition-all duration-300"
    :class="{
      'bg-light/50 border border-primary/10': !isDark,
      'bg-dark-800/50 border border-secondary/10': isDark,
    }"
  >
    <h3 class="font-heading font-bold text-lg mb-4">目录</h3>
    <ul class="space-y-2">
      <li v-for="(item, index) in tocItems" :key="index" class="toc-item">
        <a
          :href="`#${item.id}`"
          class="block py-1 px-2 rounded transition-all duration-200 text-sm"
          :class="{
            'pl-4': item.level === 2,
            'pl-6': item.level === 3,
            'pl-8': item.level === 4,
            'bg-primary/10 text-primary font-medium': activeId === item.id,
            'hover:bg-primary/5 hover:text-primary':
              activeId !== item.id && !isDark,
            'hover:bg-secondary/5 hover:text-secondary':
              activeId !== item.id && isDark,
          }"
          @click.prevent="scrollToHeading(item.id)"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  contentSelector: {
    type: String,
    default: ".blog-content",
  },
  headingSelector: {
    type: String,
    default: "h1, h2, h3, h4",
  },
  isDark: {
    type: Boolean,
    default: false,
  },
  offset: {
    type: Number,
    default: 100,
  },
});

const tocItems = ref([]);
const activeId = ref("");
const headingElements = ref([]);

// 生成目录项
const generateTocItems = () => {
  const contentElement = document.querySelector(props.contentSelector);
  if (!contentElement) return;

  const headings = contentElement.querySelectorAll(props.headingSelector);
  headingElements.value = Array.from(headings);

  tocItems.value = headingElements.value.map((heading, index) => {
    // 确保每个标题都有ID
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }

    return {
      id: heading.id,
      text: heading.textContent,
      level: parseInt(heading.tagName.substring(1)),
    };
  });
};

// 滚动到指定标题
const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (!element) return;

  const offsetTop = element.offsetTop - props.offset;
  window.scrollTo({
    top: offsetTop,
    behavior: "smooth",
  });
};

// 更新当前活动目录项
const updateActiveItem = () => {
  if (headingElements.value.length === 0) return;

  // 找到当前视口中的标题
  const scrollPosition = window.scrollY + props.offset + 10;

  // 找到当前滚动位置之前的最后一个标题
  let currentHeading = headingElements.value[0];

  for (const heading of headingElements.value) {
    if (heading.offsetTop <= scrollPosition) {
      currentHeading = heading;
    } else {
      break;
    }
  }

  activeId.value = currentHeading.id;
};

onMounted(() => {
  generateTocItems();
  window.addEventListener("scroll", updateActiveItem);
  updateActiveItem();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateActiveItem);
});

// 监听内容变化，重新生成目录
watch(() => props.contentSelector, generateTocItems);
</script>

<style scoped>
.table-of-contents {
  backdrop-filter: blur(8px);
  width: 250px;
  font-family: var(--font-sans);
}

.toc-item a {
  border-left: 2px solid transparent;
}

.toc-item a.active {
  border-left: 2px solid var(--primary);
}
</style>
