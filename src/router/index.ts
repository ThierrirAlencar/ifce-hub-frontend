import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path:"/", name: "home", component: () => import('../views/HomeView.vue')},
    {path:"/minhas-turmas", name: "minhasTurmas", component: () => import('../views/MyClassesView.vue')},
    {path:"/turmas/:id", name: "turma", component: () => import('../views/ClassView.vue')},
    {path:"/perguntas-frequentes", name: "perguntasFrequentes", component: () => import('../views/FrequentlyAskedQuestions.vue')},
    {path:"/login", name: "login", component: () => import('../views/AuthView.vue')},
    {path:"/atividades/:id", name: "atividades", component: () => import('../views/ActivitiesView.vue')}
  ],
})

export default router
