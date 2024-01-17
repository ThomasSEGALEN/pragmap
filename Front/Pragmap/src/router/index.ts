import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import authMiddleware from '@/middlewares/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/users',
			name: 'UsersIndex',
			component: () => import('@/views/users/Index.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/users/create',
			name: 'UsersCreate',
			component: () => import('@/views/users/Create.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/users/:id/edit',
			name: 'UsersEdit',
			component: () => import('@/views/users/Edit.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true },
			props: true
		},
		{
			path: '/',
			name: 'Home',
			component: () => import('@/views/Home.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/about',
			name: 'About',
			component: () => import('@/views/About.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/logout',
			name: 'Logout',
			redirect: () => {
				const authStore = useAuthStore()

				authStore.logout()

				return { name: 'Login' }
			},
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('@/views/Login.vue')
		},
		{
			path: '/forgot-password',
			name: 'ForgotPassword',
			component: () => import('@/views/ForgotPassword.vue')
		},
		{
			path: '/reset-password/:token',
			name: 'ResetPassword',
			component: () => import('@/views/ResetPassword.vue'),
			props: true
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('@/views/NotFound.vue')
		}
	]
})

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()
	const isAuthenticated = authStore.isAuthenticated
	const requiresAuth = to.meta.requiresAuth

	if (!isAuthenticated && requiresAuth) return next({ name: 'Login' })
	if (isAuthenticated && !requiresAuth) return next({ name: 'Home' })

	return next()
})

export default router
