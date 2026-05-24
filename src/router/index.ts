import { createRouter, createWebHistory } from "vue-router";
import ChatPage from "../pages/ChatPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import LibraryPage from "../pages/LibraryPage.vue";
import LoginPage from "../pages/LoginPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/chat" },
    { path: "/login", name: "login", component: LoginPage, meta: { public: true } },
    { path: "/chat", name: "chat", component: ChatPage },
    { path: "/library", name: "library", component: LibraryPage },
    { path: "/dashboard", name: "dashboard", component: DashboardPage },
  ],
});

router.beforeEach((to) => {
  const loggedIn = localStorage.getItem("knowledge_ai_logged_in") === "1";
  if (!to.meta.public && !loggedIn) {
    return "/login";
  }
  if (to.path === "/login" && loggedIn) {
    return "/chat";
  }
  return true;
});
