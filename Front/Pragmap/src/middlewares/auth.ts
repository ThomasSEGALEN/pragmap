import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores'

const authMiddleware: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) return next({ name: 'login' })

  return next()
}

export default authMiddleware
