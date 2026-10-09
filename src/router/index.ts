import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:"/", name: "home", component: () => import('../views/HomeView.vue')},
    {path:"/my-classes", name: "minhasTurmas", component: () => import('../views/MyClassesView.vue')},
    {path:"/turmas/:id", name: "turma", component: () => import('../views/ClassView.vue')},
  ],
})

export default router
