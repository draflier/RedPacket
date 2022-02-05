/*
import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";
//import {store} from "./store/index.js";
import Toasted from 'vue-toasted';


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



createApp(App).use(router).use(Toasted).mount("#app");
*/
import "@fortawesome/fontawesome-free/css/all.min.css";

import Vue from 'vue'
import App from './App.vue'
import store from "./store/index.js";
import router from "./router.js";
import Toasted from 'vue-toasted';

Vue.use(Toasted);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
