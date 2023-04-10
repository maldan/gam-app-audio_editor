import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import Main from '../page/Main.vue';
import Project from '../page/Project.vue';
import Graph from '../page/Graph.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/graph',
      name: 'Graph',
      component: Graph,
    },
    {
      path: '/project/:id',
      name: 'Project',
      component: Project,
    },
  ],
});

export default router;
