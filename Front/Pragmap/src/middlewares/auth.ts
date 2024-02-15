import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores'

export const authMiddleware: NavigationGuard = (to, from, next) => {
	const { isAuthenticated } = useAuthStore()

	if (!isAuthenticated) return next({ name: 'Login' })

	return next()
}
