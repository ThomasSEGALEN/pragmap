import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useUserStore } from '@/stores'
import authMiddleware from '@/middlewares/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		// Customers
		{
			path: '/customers',
			name: 'CustomersIndex',
			component: () => import('@/views/customers/IndexCustomers.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/customers/create',
			name: 'CustomersCreate',
			component: () => import('@/views/customers/CreateCustomers.vue'),
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		// {
		// 	path: '/customers/:id/edit',
		// 	name: 'CustomersEdit',
		// 	component: () => import('@/views/customers/Edit.vue'),
		// 	beforeEnter: (to) => {
		// 		authMiddleware

		// 		const userStore = useUserStore()

		// 		try {
		// 			userStore.getEditCustomerById(to.params.id.toString())
		// 		} catch (error) {
		// 			return { name: 'Home' }
		// 		}
		// 	},
		// 	meta: { requiresAuth: true },
		// 	props: true
		// },
		// Users
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
			beforeEnter: (to) => {
				authMiddleware

				const userStore = useUserStore()

				try {
					userStore.getEditUserById(to.params.id.toString())
				} catch (error) {
					return { name: 'Home' }
				}
			},
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
			path: '/reset-password',
			name: 'ResetPassword',
			component: () => import('@/views/ResetPassword.vue')
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
