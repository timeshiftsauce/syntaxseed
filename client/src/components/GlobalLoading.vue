<template>
  <div v-if="visible" class="global-loading-container">
    <div class="loadingio-spinner-ripple-2by998twmg8">
      <div class="ldio-yzaezf3dcmj">
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);

// 暴露给外部的方法
const show = () => {
  visible.value = true;
};

const hide = () => {
  visible.value = false;
};

// 暴露方法给外部使用
defineExpose({
  show,
  hide,
});
</script>

<style scoped>
.global-loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

@keyframes ldio-yzaezf3dcmj {
  0% {
    top: 96px;
    left: 96px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 18px;
    left: 18px;
    width: 156px;
    height: 156px;
    opacity: 0;
  }
}

.ldio-yzaezf3dcmj div {
  position: absolute;
  border-width: 4px;
  border-style: solid;
  opacity: 1;
  border-radius: 50%;
  animation: ldio-yzaezf3dcmj 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.ldio-yzaezf3dcmj div:nth-child(1) {
  border-color: #0a192f;
  animation-delay: 0s;
}

.ldio-yzaezf3dcmj div:nth-child(2) {
  border-color: #46dff0;
  animation-delay: -0.5s;
}

.loadingio-spinner-ripple-2by998twmg8 {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: transparent;
}

.ldio-yzaezf3dcmj {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0;
}

.ldio-yzaezf3dcmj div {
  box-sizing: content-box;
}
</style>
