import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'ifce-hub-theme'
const theme = ref<Theme>('light')
let initialized = false

function applyTheme(value: Theme) {
  document.documentElement.classList.toggle('dark', value === 'dark')
  document.documentElement.style.colorScheme = value
  theme.value = value
}

export function initializeTheme() {
  if (initialized) return

  const savedTheme = localStorage.getItem(STORAGE_KEY)
  const initialTheme: Theme = savedTheme === 'dark' ? 'dark' : 'light'

  applyTheme(initialTheme)
  initialized = true
}

export function useTheme() {
  initializeTheme()

  function toggleTheme() {
    const nextTheme = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
  }

  return { theme, toggleTheme }
}
