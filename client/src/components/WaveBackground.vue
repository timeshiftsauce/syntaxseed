<template>
  <div
    class="wave-container relative overflow-hidden"
    :class="{ 'dark-waves': isDark }"
  >
    <div class="wave wave1"></div>
    <div class="wave wave2"></div>
    <div class="wave wave3"></div>
    <div class="wave wave4"></div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.wave-container {
  width: 100%;
  min-height: 200px;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200px;
  bottom: 0;
  left: 0;
  background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 50 Q50 30 100 50 Q150 70 200 50 Q250 30 300 50 Q350 70 400 50 L400 100 L0 100 Z" fill="%232A9D8F" opacity="0.2"/></svg>');
  background-repeat: repeat-x;
  background-position: 0 bottom;
  background-size: 350px 100px;
  transform-origin: center bottom;
}

.dark-waves .wave {
  background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 350 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 50 Q50 30 100 50 Q150 70 200 50 Q250 30 300 50 Q350 70 400 50 L400 100 L0 100 Z" fill="%2364FFDA" opacity="0.15"/></svg>');
  background-repeat: repeat-x;
  background-position: 0 bottom;
  background-size: 350px 100px;
}

.wave1 {
  animation: wave 15s linear infinite;
  z-index: 1;
  opacity: 0.7;
  animation-delay: 0s;
  bottom: 0;
}

.wave2 {
  animation: wave 10s linear infinite;
  z-index: 2;
  opacity: 0.5;
  animation-delay: -5s;
  bottom: 10px;
}

.wave3 {
  animation: wave2 15s linear infinite;
  z-index: 3;
  opacity: 0.2;
  animation-delay: -2s;
  bottom: 15px;
}

.wave4 {
  animation: wave2 10s linear infinite;
  z-index: 4;
  opacity: 0.7;
  animation-delay: -5s;
  bottom: 20px;
}

@keyframes wave {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.8);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}

@keyframes wave2 {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(1.2);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}
</style>
