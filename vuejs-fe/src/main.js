import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

// views

import Deposit from './views/Deposit.vue'

// styles

import "@fortawesome/fontawesome-free/css/all.min.css";

// mouting point for the whole app

import App from "@/App.vue";

// routes

const routes = [
  {
    path: "/deposit",
    component: Deposit,
  },
  { path: "/:pathMatch(.*)*", redirect: "/deposit" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
