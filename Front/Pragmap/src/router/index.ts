import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import authMiddleware from '@/middlewares/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/users',
			name: 'users-index',
			component: () => import('@/views/users/Index.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/users/create',
			name: 'users-create',
			component: () => import('@/views/users/Create.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/users/:id/edit',
			name: 'users-edit',
			component: () => import('@/views/users/Edit.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true },
			props: true
		},
		{
			path: '/',
			name: 'home',
			component: () => import('@/views/Home.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('@/views/About.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/logout',
			name: 'logout',
			redirect: () => {
				const authStore = useAuthStore()

				authStore.logout()

				return { name: 'login' }
			},
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/Login.vue')
		},
		{
			path: '/forgot-password',
			name: 'forgot-password',
			component: () => import('@/views/ForgotPassword.vue')
		},
		{
			path: '/reset-password/:token',
			name: 'reset-password',
			component: () => import('@/views/ResetPassword.vue'),
			props: true
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('@/views/NotFound.vue')
		},
		{
			path: '/roadMap',
			name: 'roadMap',
			component: () => import('@/views/roadMap/RoadMap.vue'),
			beforeEnter: authMiddleware, meta: {requiresAuth: true}
		}
	]
})

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()
	const isAuthenticated = authStore.isAuthenticated
	const requiresAuth = to.meta.requiresAuth

	if (!isAuthenticated && requiresAuth) return next({ name: 'login' })
	if (isAuthenticated && !requiresAuth) return next({ name: 'home' })

	return next()
})

export default router
