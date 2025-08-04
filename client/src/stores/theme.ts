import { defineStore } from "pinia";
import { ref, watch } from "vue";

export default defineStore("theme", () => {
  const isDarkMode = ref(false);
  // 获取localstorage init
  const init = () => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      isDarkMode.value = true;
      document.documentElement.classList.add("dark");
    } else {
      isDarkMode.value = false;
      document.documentElement.classList.remove("dark");
    }
    watch(isDarkMode, (newValue) => {
      if (newValue) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    });
  };
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
  };
  return { init, isDarkMode, toggleTheme };
});
