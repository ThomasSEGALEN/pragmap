import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useFormStore } from '@/stores'
import { Role } from '@/types'
import { useToast } from '@/components/ui/toast'
import { routes } from './routes'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
})

router.beforeEach(async (to, from, next) => {
	const { toast } = useToast()
	const { getCustomerAuthorizations, getRoadmapAuthorizations, getRole, isAuthenticated } =
		useAuthStore()
	const requiresAuth = to.meta.requiresAuth as boolean
	const role = (await getRole()).name

	if (!isAuthenticated && requiresAuth) return next({ name: 'Login' })
	if (isAuthenticated && !requiresAuth) return next({ name: 'Home' })
	if (role === Role.Administrator) return next()

	const requiredRoles = to.meta.requiredRoles as Array<string>
	const authorizationsRoutes = [
		'CustomersEdit',
		'RoadmapsEdit',
		'RoadmapsSchedule',
		'RoadmapsTasks',
		'RoadmapsDeliverables'
	]
	const errorToastRedirect = () => {
		setTimeout(() => {
			toast({
				title: 'Erreur',
				description: "Vous n'avez pas les droits pour accéder à cette page",
				duration: 5000,
				variant: 'destructive'
			})
		}, 100)

		return next({ name: from.name ?? 'Home' })
	}

	if (!requiredRoles.includes(role)) return errorToastRedirect()
	if (!authorizationsRoutes.includes(to.name as string)) return next()
	if (to.name === authorizationsRoutes[0]) {
		const isAuthorized = await getCustomerAuthorizations(to.params.id as string)

		if (isAuthorized) return next()

		return errorToastRedirect()
	}
	if (authorizationsRoutes.shift()!.includes(to.name as string)) {
		const isAuthorized = await getRoadmapAuthorizations(to.params.id as string)

		if (isAuthorized) return next()

		return errorToastRedirect()
	}
})

router.afterEach((to, from) => {
	const fromRouteName = from.name?.toString()

	if (!fromRouteName) return

	const entities: { [key: string]: 'editUser' | 'editCustomer' | 'editRoadmap' } = {
		UsersEdit: 'editUser',
		CustomersEdit: 'editCustomer',
		RoadmapsEdit: 'editRoadmap'
	}

	if (!Object.keys(entities).includes(fromRouteName)) return

	const { clearEntity } = useFormStore()

	clearEntity(entities[fromRouteName])
})

export default router
