import Vue from 'vue';
import firebase from 'firebase';
import Router from 'vue-router';
import Start from './views/Start.vue';
import Login from './views/Login.vue';
import SignUp from './views/SignUp.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/start',
    },
    {
      path: '/',
      redirect: '/start',
    },
    {
      path: '/start',
      name: 'Start',
      component: Start,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: SignUp,
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('./views/Home.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/test',
      name: 'Test',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "test" */ './views/Test.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('./views/Profile.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      component: () => import('./views/Leaderboard.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/results',
      name: 'Results',
      component: () => import('./views/Results.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/assignments',
      name: 'Assignments',
      component: () => import('./views/Assignments.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/assignments/:assignment_world',
      name: 'Assignments by World',
      component: () => import('./views/AssignmentWorldBrowser.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/assignments/:assignment_world/:assignment_level',
      name: 'Assignments by Level',
      component: () => import('./views/AssignmentLevelBrowser.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/assignments/:assignment_world/:assignment_level/:assignment_id',
      name: 'Assignment',
      component: () => import('./views/AssignmentBrowser.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/challenges',
      name: 'Challenges',
      component: () => import('./views/Challenges.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/challenges/:challenge_id',
      name: 'Challenge',
      component: () => import('./views/ChallengeBrowser.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/collectibles',
      name: 'Collectibles',
      component: () => import('./views/Collectibles.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/lessons',
      name: 'Lessons',
      component: () => import('./views/Lessons.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/lessons/:lesson_world',
      name: 'Lessons by World',
      component: () => import('./views/LessonWorldBrowser.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/lessons/:lesson_world/:lesson_level',
      name: 'Lessons by Level',
      component: () => import('./views/LessonLevelBrowser.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/lessons/:lesson_world/:lesson_level/:lesson_id',
      name: 'Lesson',
      component: () => import('./views/LessonBrowser.vue'),
      meta: {
        requiresAuth: true,
      },
      props: true,
    },
    {
      path: '/creator',
      name: 'Creator',
      component: () => import('./views/Creator.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { currentUser } = firebase.auth();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('start');
  else if (!requiresAuth && currentUser) next('home');
  else next();
});

export default router;
