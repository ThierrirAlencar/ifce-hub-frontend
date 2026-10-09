import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeTheme } from './composables/useTheme'


const app = createApp(App)

app.use(router)

initializeTheme()
app.mount('#app')
