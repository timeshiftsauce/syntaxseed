import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import Fonts from "unplugin-fonts/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

/**
 * @type {import('vite').UserConfig}
 *  */
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Components({
      dts: true,
      resolvers: [PrimeVueResolver(), ElementPlusResolver()],
      types: [
        {
          from: "vue-router",
          names: ["RouterLink", "RouterView"],
        },
      ],
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      resolvers: [ElementPlusResolver()],

      vueTemplate: true,
    }),
    Fonts({
      google: {
        families: [
          {
            name: "Montserrat",
            styles: "wght@400;500;600;700",
          },
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
          {
            name: "Open Sans",
            styles: "wght@400;500;600",
          },
          {
            name: "Fira Code",
            styles: "wght@400;500",
          },
        ],
      },
    }),
  ],
  base: "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },

  server: {
    host: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://backend:7204",
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 30000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.error('🔴 Proxy Error:', err.message);
            console.error('🔴 Request URL:', req.url);
            console.error('🔴 Target:', process.env.VITE_API_BASE_URL || "http://localhost:7204");
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('🚀 Proxying Request:', req.method, req.url, '→', proxyReq.getHeader('host'));
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const status = proxyRes.statusCode;
            const statusEmoji = status >= 200 && status < 300 ? '✅' : status >= 400 ? '❌' : '⚠️';
            console.log(`${statusEmoji} Response:`, status, req.url);
            if (status >= 400) {
              console.error('🔍 Response Headers:', proxyRes.headers);
            }
          });
        },
      },
    },
  },
});
