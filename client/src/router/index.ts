import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw,
  type RouterOptions,
} from "vue-router";
import Index from "@/views/index.vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Index,
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/views/home/HomeView.vue"),
      },
      {
        path: "/blog",
        name: "blog",
        component: () => import("@/views/home/BlogView.vue"),
      },
      {
        path: "/blog/:id",
        name: "blog-detail",
        component: () => import("@/views/home/BlogDetailView.vue"),
      },
      {
        path: "/projects",
        name: "projects",
        component: () => import("@/views/home/ProjectsView.vue"),
      },
      {
        path: "/projects/:id",
        name: "project",
        component: () => import("@/views/home/ProjectsView.vue"),
      },
      {
        path: "/timeline",
        name: "timeline",
        component: () => import("@/views/home/TimelineView.vue"),
      },
      {
        path: "/tech-stack",
        name: "tech-stack",
        component: () => import("@/views/home/TechStackView.vue"),
      },
    ],
  },
  {
    path: "/Login",
    name: "login",
    component: () => import("@/views/User/Login.vue"),
  },
];
const option: RouterOptions = {
  history: createWebHistory("/"),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
};
const router: Router = createRouter(option);

export default router;
