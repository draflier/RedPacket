import Vue from "vue";
import Router from "vue-router";
import Deposit from './views/Deposit'
import Redeem from './views/Redeem'

Vue.use(Router);

export default new Router({
    // Make sure the server can handle the history mode
    // If not, set it to hash (or delete the mode)
    // More info here: https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
    mode: "history",
    routes: [
        {
          path: "/deposit",
          component: Deposit,
        },
        {
            path: "/redeem/:vaultKey?",
            component: Redeem,
        },
        { path: "/:pathMatch(.*)*", redirect: "/deposit" },
          
    ],
    linkActiveClass: "active"
});