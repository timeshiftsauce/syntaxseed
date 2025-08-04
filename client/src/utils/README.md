# 全局加载功能使用说明

## 概述

本项目实现了一个全局加载动画功能，可以在任何API请求或耗时操作中使用。加载动画使用了ripple效果，视觉效果友好。

## 组件结构

- `GlobalLoading.vue`: 全局加载组件
- `loading.js`: 全局加载服务
- `axios/index.ts`: 集成了加载功能的HTTP请求工具

## 使用方法

### 1. 在API请求中自动使用

默认情况下，所有通过`$http`发起的请求都会自动显示加载动画：

```js
import $http from "../axios";

// 默认显示加载动画
const response = await $http("/api/data", {
  method: "GET",
});

// 禁用加载动画
const response = await $http("/api/data", {
  method: "GET",
  showLoading: false,
});
```

### 2. 在组件中手动使用

可以在任何Vue组件中通过全局属性使用加载服务：

```js
// 显示加载动画
this.$loading.show();

// 隐藏加载动画
this.$loading.hide();
```

在组合式API中使用：

```js
import { getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

// 显示加载动画
proxy.$loading.show();

// 隐藏加载动画
proxy.$loading.hide();
```

### 3. 在JavaScript模块中使用

```js
import { LoadingService } from "@/utils/loading";

// 显示加载动画
LoadingService.show();

// 隐藏加载动画
LoadingService.hide();
```

## 注意事项

- 加载服务使用计数器管理多个并发请求，确保所有请求完成后才会隐藏加载动画
- 加载动画使用固定定位，覆盖整个屏幕
- 背景色为半透明白色，可以在`GlobalLoading.vue`中自定义样式
