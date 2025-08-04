import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getConfig } from "@/api";
import type { Config } from "@/utils/apiType";
const staticUrl: string = import.meta.env.VITE_staticHost;

export default defineStore("config", () => {
  const config = ref<Partial<Config>>({});
  const init = async () => {
    const res = (await getConfig()) as Config | null;
    config.value = res || {};
    return config;
  };
  const title = computed<string[]>(() => {
    if (
      config.value.title &&
      config.value.title.split("^").length === 2 &&
      config.value.title.split("^")[1].length > 0
    ) {
      return config.value.title.split("^");
    } else if (config.value.title) {
      return [config.value.title];
    } else {
      return ["SyntaxSeed"];
    }
  });
  const minTitle = computed<string>(() => {
    if (config.value.minTitle) {
      return config.value.minTitle;
    } else {
      return "";
    }
  });

  const links = computed<{ name: string; icon: string; url: string }[]>(() => {
    if (config.value.link) {
      const linkArr = JSON.parse(config.value.link) as {
        key: string;
        value: string;
      }[];
      return linkArr.map((item) => {
        return {
          name: item.key.split("^")[0],
          icon: item.key.split("^")[1],
          url: item.value,
        };
      });
    } else {
      return [];
    }
  });
  const ossBaseUrl = computed<string>(() => {
    if (config.value.upload_cdn_url) {
      return config.value.upload_cdn_url;
    } else {
      return staticUrl;
    }
  });
  const Introduction = computed<string>(() => {
    if (config.value.Introduction) {
      return config.value.Introduction;
    } else {
      return "";
    }
  });
  return {
    config,
    init,
    title,
    links,
    ossBaseUrl,
    Introduction,
    minTitle,
  };
});
