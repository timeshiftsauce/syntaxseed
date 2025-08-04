<template>
  <div class="social-links flex space-x-4">
    <a
      v-for="link in socialLinks"
      :key="link.name"
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
      :class="{
        'bg-primary/10 text-primary hover:bg-primary hover:text-white': !isDark,
        'bg-dark-800 text-secondary hover:bg-secondary hover:text-dark': isDark,
      }"
      :aria-label="link.name"
    >
      <i :class="link.icon" class="text-lg"></i>
      <span
        class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 transition-opacity duration-300"
      >
        {{ link.name }}
      </span>
    </a>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
});

const socialLinks = ref([
  {
    name: "GitHub",
    url: "https://github.com/syntaxseed",
    icon: "pi pi-github",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/syntaxseed",
    icon: "pi pi-twitter",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/syntaxseed",
    icon: "pi pi-linkedin",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/syntaxseed",
    icon: "pi pi-instagram",
  },
]);
</script>

<style scoped>
.social-link:hover .tooltip {
  opacity: 1;
}

.tooltip {
  background-color: var(--primary);
  color: white;
  z-index: 10;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: var(--primary) transparent transparent transparent;
}
</style>
