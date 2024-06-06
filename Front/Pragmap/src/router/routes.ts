import type { RouteLocationNormalized } from 'vue-router'
import { userService } from '@/services'
import { useAuthStore, useFormStore } from '@/stores'
import { Role } from '@/types'

export const routes = [
	{
		path: '/users',
		name: 'UsersIndex',
		component: () => import('@/views/users/Index.vue'),
		meta: {
			name: 'Liste des utilisateurs',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager]
		}
	},
	{
		path: '/users/create',
		name: 'UsersCreate',
		component: () => import('@/views/users/Create.vue'),
		meta: {
			name: "Création d'un utilisateur",
			requiresAuth: true,
			requiredRoles: [Role.Administrator]
		}
	},
	{
		path: '/users/:id/edit',
		name: 'UsersEdit',
		component: () => import('@/views/users/Edit.vue'),
		beforeEnter: async (to: RouteLocationNormalized) => {
			const { getEditUserById } = useFormStore()

			try {
				await getEditUserById(to.params.id.toString())
			} catch (error) {
				return '/'
			}
		},
		meta: {
			name: "Modification d'un utilisateur",
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager]
		},
		props: true
	},
	{
		path: '/customers',
		name: 'CustomersIndex',
		component: () => import('@/views/customers/Index.vue'),
		meta: {
			name: 'Liste des clients',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager]
		}
	},
	{
		path: '/customers/create',
		name: 'CustomersCreate',
		component: () => import('@/views/customers/Create.vue'),
		meta: {
			name: "Création d'un client",
			requiresAuth: true,
			requiredRoles: [Role.Administrator]
		}
	},
	{
		path: '/customers/:id/edit',
		name: 'CustomersEdit',
		component: () => import('@/views/customers/Edit.vue'),
		beforeEnter: async (to: RouteLocationNormalized) => {
			const { getEditCustomerById } = useFormStore()

			try {
				await getEditCustomerById(to.params.id.toString())
			} catch (error) {
				return '/'
			}
		},
		meta: {
			name: "Modification d'un client",
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager]
		},
		props: true
	},
	{
		path: '/roadmaps',
		name: 'RoadmapsIndex',
		component: () => import('@/views/roadmaps/Index.vue'),
		meta: {
			name: 'Liste des roadmaps',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/roadmaps/create',
		name: 'RoadmapsCreate',
		component: () => import('@/views/roadmaps/Create.vue'),
		meta: {
			name: "Création d'une roadmap",
			requiresAuth: true,
			requiredRoles: [Role.Administrator]
		}
	},
	{
		path: '/roadmaps/:id/edit',
		name: 'RoadmapsEdit',
		component: () => import('@/views/roadmaps/Edit.vue'),
		beforeEnter: async (to: RouteLocationNormalized) => {
			const { getEditRoadmapById } = useFormStore()

			try {
				await getEditRoadmapById(to.params.id.toString())
			} catch (error) {
				return '/'
			}
		},
		meta: {
			name: "Modification d'une roadmap",
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager]
		},
		props: true
	},
	{
		path: '/roadmaps/:id/designer',
		name: 'RoadmapsDesigner',
		component: () => import('@/views/roadmaps/designer/Index.vue'),
		meta: {
			name: 'Designer de roadmap',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		},
		props: true
	},
	{
		path: '/roadmaps/:id/tasks',
		name: 'RoadmapsTasks',
		component: () => import('@/views/roadmaps/tasks/Index.vue'),
		meta: {
			name: 'Tâches de la roadmap',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		},
		props: true
	},
	{
		path: '/roadmaps/:id/deliverables',
		name: 'RoadmapsDeliverables',
		component: () => import('@/views/roadmaps/deliverables/Index.vue'),
		meta: {
			name: 'Livrables de la roadmap',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		},
		props: true
	},
	{
		path: '/roadmaps/:id/schedule',
		name: 'RoadmapsSchedule',
		component: () => import('@/views/roadmaps/schedule/Index.vue'),
		meta: {
			name: 'Planning de roadmap',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/profile',
		name: 'Profile',
		component: () => import('@/views/profile/Edit.vue'),
		meta: {
			name: 'Profil',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/update-email',
		name: 'UpdateEmail',
		component: () => import('@/views/profile/Edit.vue'),
		beforeEnter: async (to: RouteLocationNormalized) => {
			if (!to.query.token) throw new Error('Token is missing')

			await userService.updateEmail(to.query.token.toString())

			const { logout } = useAuthStore()

			logout()

			return '/login'
		},
		meta: {
			name: 'UpdateEmail',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/',
		name: 'Home',
		component: () => import('@/views/Home.vue'),
		meta: {
			name: 'Accueil',
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/logout',
		name: 'Logout',
		redirect: () => {
			const { logout } = useAuthStore()

			logout()

			return '/login'
		},
		meta: {
			requiresAuth: true,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('@/views/auth/Login.vue'),
		meta: {
			requiresAuth: false,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/forgot-password',
		name: 'ForgotPassword',
		component: () => import('@/views/auth/ForgotPassword.vue'),
		meta: {
			requiresAuth: false,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/reset-password',
		name: 'ResetPassword',
		component: () => import('@/views/auth/ResetPassword.vue'),
		meta: {
			requiresAuth: false,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('@/views/NotFound.vue'),
		meta: {
			requiresAuth: false,
			requiredRoles: [Role.Administrator, Role.Manager, Role.Editor, Role.Reader]
		}
	}
]
