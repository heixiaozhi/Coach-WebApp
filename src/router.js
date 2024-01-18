import { createRouter, createWebHashHistory } from 'vue-router';
import { defineAsyncComponent } from 'vue';

// import CoachDetail from './pages/coaches/CoachDetail.vue';
import CoachesList from './pages/coaches/CoachesList.vue';
// import CoachRegistation from './pages/coaches/CoachRegistation.vue';
// import ContactCoach from './pages/requests/ContactCoach.vue';
// import RequestsReceived from './pages/requests/RequestsReceived.vue';
import NotFind from './pages/NotFind.vue';
// import UserAuth from './pages/auth/UserAuth.vue';
import store from './store/index.js';

const CoachDetail = defineAsyncComponent(() =>
  import('./pages/coaches/CoachDetail.vue')
);

const CoachRegistation = defineAsyncComponent(() =>
  import('./pages/coaches/CoachRegistation.vue')
);

const ContactCoach = defineAsyncComponent(() =>
  import('./pages/requests/ContactCoach.vue')
);

const RequestsReceived = defineAsyncComponent(() =>
  import('./pages/requests/RequestsReceived.vue')
);

const UserAuth = defineAsyncComponent(() =>
  import('./pages/auth/UserAuth.vue')
);

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      component: CoachDetail,
      props: true,
      children: [
        { path: 'contact', component: ContactCoach }, // coaches/c1/contact
      ],
    },
    {
      path: '/register',
      component: CoachRegistation,
      meta: { requiresAuth: true },
    },
    {
      path: '/requests',
      component: RequestsReceived,
      meta: { requiresAuth: true },
    },
    { path: '/:notFound(.*)', component: NotFind },
    { path: '/auth', component: UserAuth, meta: { requiresUnAuth: true } },
  ],
});

// 全局前置守卫
router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    next('/auth');
  } else if (to.meta.requiresUnAuth && store.getters.isAuthenticated) {
    next('/coaches');
  } else {
    next();
  }
});

export default router;
