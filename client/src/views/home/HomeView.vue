<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div>
    <!-- 英雄区 -->
    <section
      class="hero-section relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden"
    >
      <!-- 动态背景 -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      ></div>

      <!-- 浮动几何图形 -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="floating-shape shape-1 absolute w-64 h-64 bg-primary/10 dark:bg-code-accent/10 rounded-full blur-3xl"
        ></div>
        <div
          class="floating-shape shape-2 absolute w-96 h-96 bg-teal-300/20 dark:bg-teal-400/20 rounded-full blur-3xl"
        ></div>
        <div
          class="floating-shape shape-3 absolute w-48 h-48 bg-blue-300/30 dark:bg-blue-400/30 rounded-full blur-2xl"
        ></div>
        <div
          class="floating-shape shape-4 absolute w-32 h-32 bg-purple-300/40 dark:bg-purple-400/40 rounded-full blur-xl"
        ></div>
      </div>

      <!-- 网格背景 -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="grid-pattern"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div
          class="flex flex-col lg:flex-row items-center gap-4 lg:gap-16 pt-[20px]"
        >
          <!-- 个人简介区 -->
          <div class="lg:w-2/5 text-center lg:text-left hero-content-left">
            <div class="relative mb-8">
              <!-- 头像容器 -->
              <div class="relative w-64 h-64 mx-auto lg:mx-0">
                <!-- 装饰环 -->
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-teal-400 dark:from-code-accent dark:to-teal-300 p-1 animate-spin-slow"
                >
                  <div
                    class="w-full h-full rounded-full bg-white dark:bg-gray-900 p-2"
                  >
                    <div
                      class="w-full h-full rounded-full overflow-hidden shadow-2xl"
                    >
                      <img
                        src="../../assets/head.jpg"
                        alt="个人头像"
                        class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </div>

                <!-- 状态指示器 -->
                <div
                  class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse"
                >
                  <div
                    class="w-full h-full rounded-full bg-green-400 animate-ping"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 社交链接 -->
            <div class="flex justify-center lg:justify-start space-x-6 mb-8">
              <a
                v-for="(social, index) in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link group relative w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                :style="{ animationDelay: `${index * 0.1}s` }"
                :aria-label="social.name"
                v-tooltip="'访问 ' + social.name"
              >
                <i
                  :class="social.icon"
                  class="text-lg text-gray-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-code-accent transition-colors"
                ></i>
                <div
                  class="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-teal-400 dark:from-code-accent dark:to-teal-300 opacity-0 group-hover:opacity-20 transition-opacity"
                ></div>
              </a>
            </div>
          </div>

          <!-- 英雄区内容 -->
          <div class="lg:w-3/5 hero-content-right pb-[40px]">
            <!-- 问候语 -->
            <div class="mb-6 opacity-80 flex sm:block justify-center">
              <span
                class="inline-block px-4 py-2 rounded-full bg-primary/10 dark:bg-code-accent/10 text-primary dark:text-code-accent text-sm font-medium border border-primary/20 dark:border-code-accent/20"
              >
                👋 欢迎来到我的数字世界
              </span>
            </div>

            <!-- 主标题 -->
            <h1
              class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-none"
            >
              <span
                class="block text-gray-800 dark:text-white hero-title-line mb-3"
              >
                我是
                <span
                  class="text-primary dark:text-code-accent relative inline-block"
                >
                  {{
                    title && title.length === 2
                      ? title[0]
                      : title[0] || "Developer"
                  }}
                  <div
                    class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-teal-400 dark:from-code-accent dark:to-teal-300 rounded-full transform scale-x-0 animate-scale-x"
                  ></div>
                </span>
              </span>
              <span
                class="block text-gray-700 dark:text-gray-200 hero-title-line"
              >
                {{ title && title.length === 2 ? title[1] : "" }}
              </span>
            </h1>

            <!-- 动态文字 -->
            <div class="h-16 mb-8">
              <TypeWriter
                :texts="typewriterTexts"
                :delay="100"
                class="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-light"
              />
            </div>

            <!-- 描述文字 -->
            <p
              class="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-2xl leading-relaxed"
            >
              {{ minTitle }}
            </p>

            <!-- 用户状态展示
            <div v-if="userStore.isLoggedIn"
              class="mb-8 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
              <div class="flex items-center space-x-3">
                <Avatar v-if="userStore.userInfo?.avatar" :image="userStore.userInfo.avatar" size="normal"
                  shape="circle" />
                <Avatar v-else :label="userStore.avatarChar" size="normal" shape="circle"
                  class="bg-gradient-to-r from-primary to-teal-400 dark:from-code-accent dark:to-teal-300 text-white" />
                <div>
                  <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                    欢迎回来，{{ userStore.displayName }}！
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    您已成功登录
                  </p>
                </div>
              </div>
            </div> -->

            <!-- 行动按钮 -->
            <div
              class="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
            >
              <router-link
                to="/blog"
                class="modern-btn modern-btn-primary group"
              >
                <span class="relative z-10 flex items-center justify-center">
                  <i class="pi pi-book mr-2"></i>
                  阅读博客
                  <i
                    class="pi pi-arrow-right ml-2 group-hover:translate-x-1 transition-transform"
                  ></i>
                </span>
              </router-link>
              <router-link
                to="/projects"
                class="modern-btn modern-btn-outline group"
              >
                <span class="relative z-10 flex items-center justify-center">
                  <i class="pi pi-code mr-2"></i>
                  查看项目
                  <i
                    class="pi pi-external-link ml-2 group-hover:scale-110 transition-transform"
                  ></i>
                </span>
              </router-link>
            </div>

            <!-- 统计数据 -->
            <div
              class="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <div class="text-center stats-item">
                <div
                  class="text-2xl md:text-3xl font-bold text-primary dark:text-code-accent mb-1"
                >
                  {{ totalProjects }}+
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  项目经验
                </div>
              </div>
              <div class="text-center stats-item">
                <div
                  class="text-2xl md:text-3xl font-bold text-primary dark:text-code-accent mb-1"
                >
                  {{ latestPosts.length }}+
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  技术文章
                </div>
              </div>
              <div class="text-center stats-item">
                <div
                  class="text-2xl md:text-3xl font-bold text-primary dark:text-code-accent mb-1"
                >
                  2+
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  学习年限
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动提示 -->
      <div
        class="lg:block hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <div
          class="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
        >
          <div
            class="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-scroll-indicator"
          ></div>
        </div>
      </div>
    </section>
    <!-- 个人简介 -->
    <WaveBackground :isDark="true" class="py-16 md:py-24 animate-on-scroll">
      <div class="container mx-auto px-4 relative z-10">
        <!-- 标题部分 -->
        <div class="text-center mb-12">
          <div class="inline-block relative">
            <span
              class="absolute -left-8 -top-8 text-5xl opacity-20 text-primary dark:text-code-accent"
              >{</span
            >
            <h2
              class="text-3xl md:text-4xl font-bold mb-2 relative inline-block leading-tight"
            >
              <span class="text-primary dark:text-code-accent font-code mr-2"
                >//</span
              >关于我
            </h2>
            <span
              class="absolute -right-8 -bottom-8 text-5xl opacity-20 text-primary dark:text-code-accent"
              >}</span
            >
            <div
              class="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary dark:via-code-accent to-transparent"
            ></div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            &nbsp;前端开发 &nbsp;|&nbsp;技术宅
            &nbsp;|&nbsp;游戏狂魔&nbsp;|&nbsp;学生党
          </p>
        </div>

        <!-- 内容卡片 -->
        <div class="max-w-5xl mx-auto">
          <div class="relative">
            <!-- 装饰元素 -->
            <div
              class="absolute -left-4 md:-left-8 top-1/4 w-2 h-24 bg-gradient-to-b from-primary to-transparent rounded-full hidden md:block"
            ></div>
            <div
              class="absolute -right-4 md:-right-8 bottom-1/4 w-2 h-24 bg-gradient-to-t from-primary to-transparent rounded-full hidden md:block"
            ></div>

            <!-- 主卡片 -->
            <div
              class="bio-card transform transition-all duration-500 hover:translate-y-[-5px]"
            >
              <div v-if="introduction" class="relative z-10">
                <!-- 装饰图标 -->
                <div
                  class="absolute -top-6 -right-6 text-primary dark:text-code-accent opacity-10 text-7xl rotate-12"
                >
                  <i class="iconfont icon-code"></i>
                </div>

                <!-- 内容区域 -->
                <div
                  class="prose prose-lg max-w-none dark:prose-invert text-justify space-y-6 relative"
                >
                  <div class="intro-content" v-html="introduction"></div>
                </div>

                <!-- 底部装饰 -->
                <div class="flex justify-center mt-8 space-x-4">
                  <span
                    v-for="i in 3"
                    :key="i"
                    class="inline-block w-2 h-2 rounded-full bg-primary dark:bg-code-accent opacity-70"
                  ></span>
                </div>
              </div>

              <!-- 加载状态 -->
              <div v-else class="text-center py-12 space-y-6">
                <div class="relative w-24 h-24 mx-auto">
                  <div
                    class="absolute inset-0 rounded-full border-4 border-dashed border-primary dark:border-code-accent animate-spin opacity-30"
                  ></div>
                  <div
                    class="absolute inset-4 rounded-full border-4 border-dashed border-primary dark:border-code-accent animate-spin opacity-60"
                    style="animation-direction: reverse; animation-duration: 3s"
                  ></div>
                  <div
                    class="absolute inset-8 rounded-full border-4 border-dashed border-primary dark:border-code-accent animate-spin opacity-90"
                    style="animation-duration: 5s"
                  ></div>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-lg">
                  正在加载量子纠缠简介...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 背景装饰元素 -->
      <div
        class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
      >
        <!-- 左侧装饰 -->
        <div
          class="absolute -left-16 top-1/4 w-32 h-32 bg-primary dark:bg-code-accent rounded-full opacity-5 blur-3xl"
        ></div>
        <!-- 右侧装饰 -->
        <div
          class="absolute -right-16 bottom-1/4 w-48 h-48 bg-primary dark:bg-code-accent rounded-full opacity-5 blur-3xl"
        ></div>
        <!-- 中间装饰 -->
        <div
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary dark:bg-code-accent rounded-full opacity-5 blur-3xl"
        ></div>
      </div>
    </WaveBackground>
    <!-- 精选项目展示 -->
    <section
      class="py-16 bg-white dark:bg-gray-900 relative overflow-hidden animate-on-scroll"
    >
      <!-- 背景装饰元素 -->
      <div
        class="absolute -top-24 -right-24 w-64 h-64 bg-primary dark:bg-code-accent rounded-full opacity-5 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-32 -left-32 w-80 h-80 bg-primary dark:bg-code-accent rounded-full opacity-5 blur-3xl"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <div class="inline-block relative">
            <span
              class="absolute -left-6 -top-6 text-4xl opacity-20 text-primary dark:text-code-accent"
              >{</span
            >
            <h2
              class="text-3xl md:text-4xl font-bold mb-2 relative inline-block leading-tight"
            >
              <span class="text-primary dark:text-code-accent font-code mr-2"
                >//</span
              >精选项目
            </h2>
            <span
              class="absolute -right-6 -bottom-6 text-4xl opacity-20 text-primary dark:text-code-accent"
              >}</span
            >
            <div
              class="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary dark:via-code-accent to-transparent"
            ></div>
          </div>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-4">
            这些是我最近完成的一些项目，展示了我的技术栈和解决问题的能力。
          </p>
        </div>

        <!-- 项目展示区域 -->
        <div
          v-if="isProjectsLoading"
          class="flex justify-center items-center py-16"
        >
          <div class="relative w-16 h-16">
            <div
              class="absolute inset-0 rounded-full border-4 border-dashed border-primary dark:border-code-accent animate-spin opacity-30"
            ></div>
            <div
              class="absolute inset-3 rounded-full border-4 border-dashed border-primary dark:border-code-accent animate-spin opacity-60"
              style="animation-direction: reverse; animation-duration: 3s"
            ></div>
          </div>
        </div>

        <div v-else-if="projects.length === 0" class="text-center py-16">
          <div class="text-5xl mb-4 opacity-30">🔍</div>
          <p class="text-gray-500 dark:text-gray-400">暂无项目</p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <ProjectCard
            v-for="project in projects"
            :key="project.id"
            :project="project"
            @view-details="viewProjectDetails"
          />
        </div>

        <div class="text-center mt-12 space-y-4">
          <router-link
            to="/projects"
            class="modern-btn modern-btn-primary group inline-flex sm:w-auto w-full max-w-xs mx-auto"
          >
            <span class="relative z-10 flex items-center justify-center">
              <i class="pi pi-code mr-2"></i>
              查看全部项目
              <i
                class="pi pi-arrow-right ml-2 group-hover:translate-x-1 transition-transform"
              ></i>
            </span>
          </router-link>

          <p class="text-sm text-gray-500 dark:text-gray-400">
            已展示 {{ projects.length }} 个项目，共有 {{ totalProjects }} 个项目
          </p>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section
      class="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden animate-on-scroll"
    >
      <!-- 背景装饰 -->
      <div class="absolute inset-0 opacity-30">
        <div
          class="absolute top-20 left-10 w-2 h-32 bg-gradient-to-b from-primary to-transparent rounded-full animate-pulse"
        ></div>
        <div
          class="absolute bottom-20 right-10 w-2 h-24 bg-gradient-to-t from-teal-400 to-transparent rounded-full animate-pulse"
          style="animation-delay: 1s"
        ></div>
        <div
          class="absolute top-1/2 left-1/4 w-1 h-16 bg-gradient-to-b from-blue-400 to-transparent rounded-full animate-pulse"
          style="animation-delay: 2s"
        ></div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <div class="inline-block relative">
            <span
              class="absolute -left-6 -top-6 text-4xl opacity-20 text-primary dark:text-code-accent"
              >[</span
            >
            <h2
              class="text-4xl md:text-5xl font-bold mb-4 relative inline-block"
            >
              <span class="text-primary dark:text-code-accent font-code mr-3"
                >//</span
              >
              <span
                class="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
              >
                最新文章
              </span>
            </h2>
            <span
              class="absolute -right-6 -bottom-6 text-4xl opacity-20 text-primary dark:text-code-accent"
              >]</span
            >
            <div
              class="h-1 w-40 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary dark:via-code-accent to-transparent rounded-full"
            ></div>
          </div>
          <p
            class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-6 leading-relaxed"
          >
            分享我的技术见解、学习心得和项目开发过程中的经验教训
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div
            v-for="(post, index) in latestPosts"
            :key="post.id"
            class="blog-card-wrapper"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <BlogPostCard :post="post" />
          </div>
        </div>

        <div class="text-center">
          <router-link
            to="/blog"
            class="modern-btn modern-btn-primary group inline-flex sm:w-auto w-full max-w-xs mx-auto"
          >
            <span class="relative z-10 flex items-center justify-center">
              <i class="pi pi-book mr-2"></i>
              浏览全部文章
              <i
                class="pi pi-arrow-right ml-2 group-hover:translate-x-1 transition-transform"
              ></i>
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 技术栈云 -->
    <section
      class="py-20 bg-white dark:bg-gray-900 relative overflow-hidden animate-on-scroll"
    >
      <!-- 动态背景网格 -->
      <div class="absolute inset-0 opacity-5 dark:opacity-10">
        <div class="tech-grid-pattern"></div>
      </div>

      <!-- 浮动代码片段 -->
      <div
        class="absolute inset-0 overflow-hidden pointer-events-none opacity-10"
      >
        <div
          class="code-float code-1 absolute text-xs font-mono text-primary dark:text-code-accent"
        >
          const skills = [];
        </div>
        <div class="code-float code-2 absolute text-xs font-mono text-teal-500">
          function learn() {}
        </div>
        <div class="code-float code-3 absolute text-xs font-mono text-blue-500">
          import React from 'react';
        </div>
        <div
          class="code-float code-4 absolute text-xs font-mono text-purple-500"
        >
          npm install
        </div>
      </div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <div class="inline-block relative">
            <span
              class="absolute -left-8 -top-8 text-5xl opacity-20 text-primary dark:text-code-accent"
              >&lt;</span
            >
            <h2
              class="text-4xl md:text-5xl font-bold mb-4 relative inline-block"
            >
              <span class="text-primary dark:text-code-accent font-code mr-3"
                >//</span
              >
              <span
                class="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent"
              >
                技术栈
              </span>
            </h2>
            <span
              class="absolute -right-8 -bottom-8 text-5xl opacity-20 text-primary dark:text-code-accent"
              >/&gt;</span
            >
            <div
              class="h-1 w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary dark:via-code-accent to-transparent rounded-full"
            ></div>
          </div>
          <p
            class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-6 leading-relaxed"
          >
            这些是我目前掌握和正在学习的技术栈，持续更新中...
          </p>
        </div>

        <!-- 技术栈云 -->
        <div class="relative">
          <div class="flex flex-wrap justify-center gap-4 mb-12">
            <div
              v-for="(tech, index) in techStack"
              :key="tech.name"
              class="tech-badge-modern group cursor-pointer"
              :style="{
                fontSize: `calc(0.85rem + ${tech.level * 0.008}rem)`,
                animationDelay: `${index * 0.1}s`,
              }"
              v-tooltip="`${tech.name} - 掌握度 ${tech.level}%`"
            >
              <span class="relative z-10">{{ tech.name }}</span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-primary to-teal-400 dark:from-code-accent dark:to-teal-300 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300 scale-0 group-hover:scale-100"
              ></div>

              <!-- 技能等级指示器 -->
              <div
                class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div
                  class="h-full bg-gradient-to-r from-primary to-teal-400 dark:from-code-accent dark:to-teal-300 rounded-full transition-all duration-500"
                  :style="{ width: `${tech.level}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 技术分类展示 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="tech-category-card group">
              <div class="text-center p-6">
                <div
                  class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                >
                  <i class="pi pi-desktop text-2xl text-white"></i>
                </div>
                <h3
                  class="text-xl font-bold mb-2 text-gray-800 dark:text-white"
                >
                  前端开发
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  Vue.js, React, TypeScript
                </p>
              </div>
            </div>

            <div class="tech-category-card group">
              <div class="text-center p-6">
                <div
                  class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center"
                >
                  <i class="pi pi-server text-2xl text-white"></i>
                </div>
                <h3
                  class="text-xl font-bold mb-2 text-gray-800 dark:text-white"
                >
                  后端开发
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  Node.js, Express, MySQL
                </p>
              </div>
            </div>

            <div class="tech-category-card group">
              <div class="text-center p-6">
                <div
                  class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
                >
                  <i class="pi pi-cog text-2xl text-white"></i>
                </div>
                <h3
                  class="text-xl font-bold mb-2 text-gray-800 dark:text-white"
                >
                  开发工具
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  Git, Vite, Docker
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <router-link
            to="/tech-stack"
            class="modern-btn modern-btn-outline group inline-flex sm:w-auto w-full max-w-xs mx-auto"
          >
            <span class="relative z-10 flex items-center justify-center">
              <i class="pi pi-chart-bar mr-2"></i>
              查看详细技术栈
              <i
                class="pi pi-external-link ml-2 group-hover:scale-110 transition-transform"
              ></i>
            </span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, ref, nextTick } from "vue";
import TypeWriter from "../../components/TypeWriter.vue";
import { useUserStore } from "@/stores/userAuth.ts";
import ProjectCard from "../../components/ProjectCard.vue";
import BlogPostCard from "../../components/BlogPostCard.vue";
import WaveBackground from "../../components/WaveBackground.vue";
import { useRouter } from "vue-router";
import { getTypewriterTexts, getProjects, getTechStack, getBlogs } from "@/api";
import useConfig from "../../stores/config.ts";
import { storeToRefs } from "pinia";
import type {
  Blog,
  Project,
  TechStack,
  TypewriterTexts,
} from "@/utils/apiType.ts";
import { useSEO } from "@/composables/useSEO";
export default {
  name: "HomeView",
  components: {
    TypeWriter,
    ProjectCard,
    BlogPostCard,
    WaveBackground,
  },
  setup() {
    const router = useRouter();
    const config = useConfig();
    const { title, links, minTitle } = storeToRefs(config);
    const userStore = useUserStore();
    const socialLinks = links;
    const introduction = computed(() => config.Introduction);

    // 使用 SEO
    useSEO();
    // 滚动动画观察器
    const setupScrollAnimations = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px  0px 0px" },
      );

      // 观察需要动画的元素
      nextTick(() => {
        const animateElements = document.querySelectorAll(".animate-on-scroll");
        animateElements.forEach((el) => observer.observe(el));
      });
    };

    // 组件挂载后设置滚动动画
    nextTick(() => {
      setupScrollAnimations();
    });
    const typewriterTexts = ref([
      "欢迎来到我的个人网站！",
      "记录我的编程之旅",
      "分享技术心得和项目经验",
      "追踪成长轨迹",
    ]);
    getTypewriterTexts()
      .then((res) => {
        typewriterTexts.value = res.data;
      })
      .catch((err) => {});

    // 项目相关状态
    const projects = ref<Project["data"]>([]);
    const isProjectsLoading = ref(true);
    const projectsError = ref(null);
    const totalProjects = ref(0);

    // 查看项目详情
    const viewProjectDetails = (projectId: string) => {
      router.push({
        name: "project",
        params: { id: projectId },
      });
    };

    // 获取精选项目
    getProjects({ limit: 6, featured: true })
      .then((res) => {
        projects.value = res.data;
        totalProjects.value = res.total || 0;
        isProjectsLoading.value = false;
      })
      .catch((err) => {
        projectsError.value = err;
        isProjectsLoading.value = false;
      });

    const latestPosts = ref<Blog["data"]>([]);
    getBlogs({ page: 1, limit: 2 })
      .then((res) => {
        latestPosts.value = res.data;
      })
      .catch((err) => {
        // 加载失败时使用默认数据
        latestPosts.value = [];
      });

    const techStack = ref<TechStack["data"]>();
    getTechStack()
      .then((res) => {
        techStack.value = res.data;
      })
      .catch((err) => {});

    return {
      typewriterTexts,
      socialLinks,
      projects,
      latestPosts,
      techStack,
      minTitle,
      title,
      introduction,
      // 新增项目相关状态
      isProjectsLoading,
      totalProjects,
      viewProjectDetails,
      // 用户状态
      userStore,
    };
  },
};
</script>

<style scoped lang="scss">
/* 现代化样式 */
/* 英雄区动画 */
.hero-section {
  animation: fadeInUp 1s ease-out;
}

.hero-content-left {
  animation: slideInLeft 1s ease-out 0.2s both;
}

.hero-content-right {
  animation: slideInRight 1s ease-out 0.4s both;
}

.hero-title-line {
  animation: fadeInUp 0.8s ease-out both;
}

.hero-title-line:nth-child(2) {
  animation-delay: 0.2s;
}

/* 浮动几何图形动画 */
.floating-shape {
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  top: 30%;
  right: 30%;
  animation-delay: 1s;
}

/* 网格背景 */
.grid-pattern {
  background-image:
    linear-gradient(rgba(42, 157, 143, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(42, 157, 143, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  width: 100%;
  height: 100%;
}

.dark .grid-pattern {
  background-image:
    linear-gradient(rgba(100, 255, 218, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 255, 218, 0.1) 1px, transparent 1px);
}

/* 技术栈网格背景 */
.tech-grid-pattern {
  background-image:
    radial-gradient(
      circle at 25% 25%,
      rgba(42, 157, 143, 0.1) 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(42, 157, 143, 0.1) 2px,
      transparent 2px
    );
  background-size: 100px 100px;
  width: 100%;
  height: 100%;
}

/* Modern button styles moved to global CSS for consistency */

/* 社交链接动画 */
.social-link {
  animation: fadeInUp 0.6s ease-out both;
}

/* 统计数据动画 */
.stats-item {
  animation: fadeInUp 0.8s ease-out both;
}

.stats-item:nth-child(1) {
  animation-delay: 0.2s;
}

.stats-item:nth-child(2) {
  animation-delay: 0.4s;
}

.stats-item:nth-child(3) {
  animation-delay: 0.6s;
}

/* 技术栈徽章现代化样式 */
.tech-badge-modern {
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(229, 231, 235, 0.5);
  color: rgb(55, 65, 81);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
  animation: fadeInUp 0.6s ease-out both;
}

.tech-badge-modern:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.dark .tech-badge-modern {
  background-color: rgba(31, 41, 55, 0.8);
  border-color: rgba(75, 85, 99, 0.5);
  color: rgb(209, 213, 219);
}

/* 技术分类卡片 */
.tech-category-card {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  border: 1px solid rgba(229, 231, 235, 0.5);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1) translateY(0);
}

.tech-category-card:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: scale(1.05) translateY(-0.5rem);
}

.dark .tech-category-card {
  background-color: rgba(31, 41, 55, 0.8);
  border-color: rgba(75, 85, 99, 0.5);
}

/* 博客卡片包装器 */
.blog-card-wrapper {
  animation: fadeInUp 0.8s ease-out both;
}

/* 浮动代码片段 */
.code-float {
  animation: codeFloat 8s ease-in-out infinite;
}

.code-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.code-2 {
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.code-3 {
  bottom: 30%;
  left: 15%;
  animation-delay: 4s;
}

.code-4 {
  top: 40%;
  right: 25%;
  animation-delay: 6s;
}

/* 关键帧动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  33% {
    transform: translateY(-20px) rotate(5deg);
  }

  66% {
    transform: translateY(10px) rotate(-5deg);
  }
}

@keyframes codeFloat {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.3;
  }

  25% {
    transform: translateY(-10px) translateX(5px);
    opacity: 0.6;
  }

  50% {
    transform: translateY(5px) translateX(-5px);
    opacity: 0.4;
  }

  75% {
    transform: translateY(-5px) translateX(10px);
    opacity: 0.7;
  }
}

@keyframes animate-spin-slow {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes animate-scale-x {
  0% {
    transform: scaleX(0);
  }

  50% {
    transform: scaleX(1);
  }

  100% {
    transform: scaleX(0);
  }
}

@keyframes animate-scroll-indicator {
  0% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(20px);
    opacity: 0;
  }
}

/* 自定义动画类 */
.animate-spin-slow {
  animation: animate-spin-slow 20s linear infinite;
}

.animate-scale-x {
  animation: animate-scale-x 2s ease-in-out infinite;
}

.animate-scroll-indicator {
  animation: animate-scroll-indicator 2s ease-in-out infinite;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .tech-badge-modern {
    font-size: 0.9rem !important;
    padding: 0.5rem 0.75rem;
  }

  /* Modern button responsive styles moved to global CSS */

  .hero-section {
    min-height: calc(100vh - 64px);
    /* 减去导航栏高度 */
    padding-top: 1rem;
  }

  .floating-shape {
    display: none;
  }
}

@media (max-width: 768px) {
  .hero-content-left,
  .hero-content-right {
    animation: fadeInUp 1s ease-out both;
  }
}

/* 卡片浮动动画 */
@keyframes card-float {
  0%,
  100% {
    transform: translateY(0) rotateZ(0deg);
  }

  50% {
    transform: translateY(-8px) rotateZ(1deg);
  }
}

/* 文本显示动画 */
@keyframes text-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 呼吸光效动画 */
@keyframes pulse-glow {
  0%,
  100% {
    box-shadow:
      0 0 15px rgba(42, 157, 143, 0.2),
      0 0 30px rgba(42, 157, 143, 0.1);
  }

  50% {
    box-shadow:
      0 0 25px rgba(42, 157, 143, 0.3),
      0 0 50px rgba(42, 157, 143, 0.2);
  }
}

/* 打字机光标动画 */
@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* 波浪动画 */
@keyframes wave-animation {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

/* 个人简介卡片样式 */
.bio-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  animation: pulse-glow 6s ease-in-out infinite;
}

.bio-card::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  animation: slide 3s linear infinite;
}

.bio-card::after {
  content: "";
  position: absolute;
  bottom: -2px;
  right: -2px;
  left: -2px;
  height: 3px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--code-accent),
    transparent
  );
  animation: slide 3s linear infinite;
  animation-delay: 1.5s;
}

@keyframes slide {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* 内容样式 */
.intro-content {
  position: relative;
  animation: text-reveal 1.2s ease-out forwards;
}

.intro-content :deep(p) {
  position: relative;
  z-index: 2;
  margin-bottom: 1rem;
  line-height: 1.8;
}

.intro-content :deep(p):first-of-type::first-letter {
  font-size: 1.8em;
  font-weight: bold;
  color: var(--primary);
  float: left;
  line-height: 1;
  margin-right: 0.2em;
}

/* wangeditor 内容样式 */
.intro-content :deep(h1) {
  font-size: 1.8rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
  border-bottom: 1px solid rgba(42, 157, 143, 0.2);
  padding-bottom: 0.5rem;
}

.intro-content :deep(h2) {
  font-size: 1.5rem;
  margin-top: 1.2rem;
  margin-bottom: 0.8rem;
  color: var(--primary);
}

.intro-content :deep(h3) {
  font-size: 1.3rem;
  margin-top: 1rem;
  margin-bottom: 0.6rem;
  color: var(--primary);
}

.intro-content :deep(ul),
.intro-content :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.intro-content :deep(ul) li {
  list-style-type: disc;
  margin-bottom: 0.5rem;
}

.intro-content :deep(ol) li {
  list-style-type: decimal;
  margin-bottom: 0.5rem;
}

.intro-content :deep(a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--primary);
  transition: all 0.3s ease;
}

.intro-content :deep(a):hover {
  color: var(--code-accent);
  border-bottom: 1px solid var(--code-accent);
}

.intro-content :deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: rgba(75, 85, 99, 0.9);
  background-color: rgba(42, 157, 143, 0.05);
  padding: 1rem;
  border-radius: 0 0.5rem 0.5rem 0;
  margin-bottom: 1rem;
}

.intro-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.intro-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 0.5rem;

  th {
    background-color: rgba(42, 157, 143, 0.1);
    padding: 0.75rem;
    text-align: left;
    font-weight: bold;
    border-bottom: 2px solid rgba(42, 157, 143, 0.2);
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid rgba(42, 157, 143, 0.1);
  }

  tr:nth-child(even) {
    background-color: rgba(42, 157, 143, 0.03);
  }
}

.intro-content :deep(pre) {
  background-color: rgba(10, 25, 47, 0.8);
  // padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  position: relative;

  // 隐藏滚动条
  ::-webkit-scrollbar {
    display: none;
  }

  code {
    color: var(--code-accent);
    font-family: "Fira Code", monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

// .intro-content :deep(code):not(pre code) {
//   background-color: rgba(42, 157, 143, 0.1);
//   padding: 0.2rem 0.4rem;
//   border-radius: 0.25rem;
//   font-family: "Fira Code", monospace;
//   font-size: 0.9em;
//   color: var(--primary);
// }

.intro-content :deep(hr) {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  margin: 1.5rem 0;
}

/* 暗色模式适配 */
.dark .intro-content :deep(blockquote) {
  color: rgba(229, 231, 235, 0.9);
  background-color: rgba(100, 255, 218, 0.05);
}

.dark .intro-content :deep(table) th {
  background-color: rgba(100, 255, 218, 0.1);
  border-bottom: 2px solid rgba(100, 255, 218, 0.2);
}

.dark .intro-content :deep(table) td {
  border-bottom: 1px solid rgba(100, 255, 218, 0.1);
}

.dark .intro-content :deep(table) tr:nth-child(even) {
  background-color: rgba(100, 255, 218, 0.03);
}

/* 装饰元素样式 */
.font-code {
  font-family: "Fira Code", monospace;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bio-card {
    padding: 1.5rem;
  }
}

/* 滚
动触发动画 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(
    to bottom,
    var(--color-primary-light),
    var(--color-accent-teal)
  );
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    to bottom,
    var(--color-accent-teal),
    var(--color-primary-light)
  );
}

.dark ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(
    to bottom,
    var(--color-accent-cyan),
    var(--color-accent-teal)
  );
}

/* 减少动画偏好设置 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .animate-on-scroll {
    opacity: 1;
    transform: none;
  }

  .floating-shape {
    animation: none;
  }
}
</style>
