import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware } from '@/middlewares'
import { useAuthStore, useCustomerStore, useUserStore } from '@/stores'
import { userService } from '@/services'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/users',
			name: 'UsersIndex',
			component: () => import('@/views/users/Index.vue'),
			beforeEnter: authMiddleware,
			meta: { name: 'Liste des utilisateurs', requiresAuth: true }
		},
		{
			path: '/users/create',
			name: 'UsersCreate',
			component: () => import('@/views/users/Create.vue'),
			beforeEnter: authMiddleware,
			meta: { name: "Création d'un utilisateur", requiresAuth: true }
		},
		{
			path: '/users/:id/edit',
			name: 'UsersEdit',
			component: () => import('@/views/users/Edit.vue'),
			beforeEnter: async (to) => {
				authMiddleware

				const { getEditUserById } = useUserStore()

				try {
					await getEditUserById(to.params.id.toString())
				} catch (error) {
					return '/'
				}
			},
			meta: { name: "Modification d'un utilisateur", requiresAuth: true },
			props: true
		},
		{
			path: '/customers',
			name: 'CustomersIndex',
			component: () => import('@/views/customers/Index.vue'),
			beforeEnter: authMiddleware,
			meta: { name: 'Liste des clients', requiresAuth: true }
		},
		{
			path: '/customers/create',
			name: 'CustomersCreate',
			component: () => import('@/views/customers/Create.vue'),
			beforeEnter: authMiddleware,
			meta: { name: "Création d'un client", requiresAuth: true }
		},
		{
			path: '/customers/:id/edit',
			name: 'CustomersEdit',
			component: () => import('@/views/customers/Edit.vue'),
			beforeEnter: async (to) => {
				authMiddleware

				const { getEditCustomerById } = useCustomerStore()

				try {
					await getEditCustomerById(to.params.id.toString())
				} catch (error) {
					return '/'
				}
			},
			meta: { name: "Modification d'un client", requiresAuth: true },
			props: true
		},
		{
			path: '/roadmap',
			name: 'Roadmap',
			component: () => import('@/views/roadmaps/Roadmap.vue'),
			beforeEnter: authMiddleware,
			meta: { name: 'Roadmap', requiresAuth: true }
		},
		{
			path: '/profile',
			name: 'Profile',
			component: () => import('@/views/profile/Edit.vue'),
			beforeEnter: authMiddleware,
			meta: { name: 'Profil', requiresAuth: true }
		},
		{
			path: '/update-email',
			name: 'UpdateEmail',
			component: () => import('@/views/profile/Edit.vue'),
			beforeEnter: async (to) => {
				if (!to.query.token) throw new Error('Token is missing')

				await userService.updateEmail(to.query.token.toString())

				const { logout } = useAuthStore()

				logout()

				return '/login'
			},
			meta: { name: 'UpdateEmail', requiresAuth: true }
		},
		{
			path: '/',
			name: 'Home',
			component: () => import('@/views/Home.vue'),
			beforeEnter: authMiddleware,
			meta: { name: 'Accueil', requiresAuth: true }
		},
		{
			path: '/logout',
			name: 'Logout',
			redirect: () => {
				const { logout } = useAuthStore()

				logout()

				return '/login'
			},
			beforeEnter: authMiddleware,
			meta: { requiresAuth: true }
		},
		{
			path: '/login',
			name: 'Login',
			component: () => import('@/views/auth/Login.vue'),
			meta: { requiresAuth: false }
		},
		{
			path: '/forgot-password',
			name: 'ForgotPassword',
			component: () => import('@/views/auth/ForgotPassword.vue'),
			meta: { requiresAuth: false }
		},
		{
			path: '/reset-password',
			name: 'ResetPassword',
			component: () => import('@/views/auth/ResetPassword.vue'),
			meta: { requiresAuth: false }
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('@/views/NotFound.vue'),
			meta: { requiresAuth: false }
		}
	]
})

router.beforeEach((to, from, next) => {
	const { isAuthenticated } = useAuthStore()
	const requiresAuth = to.meta.requiresAuth

	if (!isAuthenticated && requiresAuth) return next({ name: 'Login' })
	if (isAuthenticated && !requiresAuth) return next({ name: 'Home' })

	return next()
})

export default router
