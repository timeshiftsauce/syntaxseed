<template>
  <div class="share-buttons">
    <h3 class="text-lg font-heading font-bold mb-3">分享文章</h3>
    <div class="flex space-x-3">
      <button
        v-for="button in shareButtons"
        :key="button.name"
        @click="shareContent(button.type)"
        class="share-button flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
        :class="{
          'bg-primary/10 text-primary hover:bg-primary hover:text-white':
            !isDark,
          'bg-dark-800 text-secondary hover:bg-secondary hover:text-dark':
            isDark,
        }"
        :aria-label="`分享到${button.name}`"
      >
        <i :class="button.icon" class="text-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  isDark: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const shareButtons = ref([
  { name: "Twitter", type: "twitter", icon: "pi pi-twitter" },
  { name: "Facebook", type: "facebook", icon: "pi pi-facebook" },
  { name: "LinkedIn", type: "linkedin", icon: "pi pi-linkedin" },
  { name: "WeChat", type: "wechat", icon: "pi pi-comments" },
  { name: "复制链接", type: "copy", icon: "pi pi-copy" },
]);

const shareContent = (type) => {
  // 获取当前页面URL
  const currentUrl = props.url || window.location.href;
  const title = props.title;
  const summary = props.summary || title;

  let shareUrl = "";

  switch (type) {
    case "twitter":
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`;
      window.open(shareUrl, "_blank");
      break;

    case "facebook":
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
      window.open(shareUrl, "_blank");
      break;

    case "linkedin":
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
      window.open(shareUrl, "_blank");
      break;

    case "wechat":
      // 这里通常需要生成二维码，简化处理
      alert('请打开微信，使用"扫一扫"，扫描网页中的二维码。');
      break;

    case "copy":
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          alert("链接已复制到剪贴板！");
        })
        .catch((err) => {
          console.error("复制失败:", err);
          alert("复制失败，请手动复制链接。");
        });
      break;
  }
};
</script>

<style scoped>
.share-button {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.share-button:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
