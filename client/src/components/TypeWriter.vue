<template>
  <div class="typewriter">
    <span class="typewriter-text">{{ displayText }}</span>
    <span class="typewriter-cursor" :class="{ blink: isCursorBlinking }"
      >|</span
    >
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "TypeWriter",
  props: {
    texts: {
      type: Array,
      required: true,
      default: () => [],
    },
    delay: {
      type: Number,
      default: 100,
    },
    pauseTime: {
      type: Number,
      default: 1500,
    },
  },
  setup(props) {
    const displayText = ref("");
    const isCursorBlinking = ref(true);
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingInterval = null;

    const type = () => {
      // 检查texts数组是否为空
      if (!props.texts || props.texts.length === 0) {
        displayText.value = "";
        return;
      }

      // 当前要显示的完整文本
      const fullText = props.texts[currentTextIndex] || "";
      const charArray = Array.from(fullText);
      const charLength = charArray.length;

      if (isDeleting) {
        // 删除模式：从后往前删除字符
        displayText.value = charArray.slice(0, currentCharIndex - 1).join("");
        currentCharIndex--;
      } else {
        // 输入模式：从前往后添加字符
        displayText.value = charArray.slice(0, currentCharIndex + 1).join("");
        currentCharIndex++;
      }

      // 控制光标闪烁
      isCursorBlinking.value = false;

      // 判断是否完成当前文本的输入或删除
      if (!isDeleting && currentCharIndex === charLength) {
        // 输入完成，暂停一段时间后开始删除
        isDeleting = true;
        isCursorBlinking.value = true;

        // 清除当前定时器
        clearTimeout(typingInterval);

        // 设置暂停后的新定时器
        typingInterval = setTimeout(() => {
          isCursorBlinking.value = false;
          type(); // 直接调用type函数而不是设置新的interval
        }, props.pauseTime);
        return;
      } else if (isDeleting && currentCharIndex === 0) {
        // 删除完成，切换到下一个文本
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % props.texts.length;
        isCursorBlinking.value = true;

        // 清除当前定时器
        clearTimeout(typingInterval);

        // 设置暂停后的新定时器
        typingInterval = setTimeout(() => {
          isCursorBlinking.value = false;
          type(); // 直接调用type函数而不是设置新的interval
        }, props.pauseTime / 2);
        return;
      }

      // 控制删除速度比输入速度快一点
      const typeSpeed = isDeleting ? props.delay / 2 : props.delay;

      // 清除之前的定时器，确保只有一个定时器在运行
      clearTimeout(typingInterval);
      typingInterval = setTimeout(type, typeSpeed);
    };

    onMounted(() => {
      if (props.texts && props.texts.length > 0) {
        setTimeout(type, props.delay);
      }
    });

    onBeforeUnmount(() => {
      clearTimeout(typingInterval);
    });

    return {
      displayText,
      isCursorBlinking,
    };
  },
};
</script>

<style scoped>
.typewriter {
  display: inline-block;
}

.typewriter-cursor {
  display: inline-block;
  color: currentColor;
  margin-left: 2px;
  font-weight: bold;
}

.typewriter-cursor.blink {
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
