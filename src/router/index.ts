import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Init from '@/views/Init/Init.vue';
import Liquidity from '@/views/Liquidity/Liquidity.vue';
// import SinglePool from '@/views/Liquidity/SinglePool.vue';
import Trade from '@/views/Trade/Trade.vue';
import Wallet from '@/views/Wallet/Wallet.vue';
import NotFound from '@/views/Error/NotFound.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Init',
    component: Init,
    meta: {
      layout: 'LayoutInitial',
    },
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: Wallet,
    meta: {
      layout: 'LayoutDefault',
    },
  },
  {
    path: '/trade',
    name: 'Trade',
    component: Trade,
    meta: {
      layout: 'LayoutDefault',
    },
  },
  {
    path: '/liquidity',
    name: 'Liquidity',
    component: Liquidity,
    meta: {
      layout: 'LayoutDefault',
    },
  },
  {
    path: '/:catchAll(.*)',
    component: NotFound,
    meta: {
      layout: 'LayoutDefault',
    },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes,
});

export default router;
