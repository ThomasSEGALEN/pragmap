import { customerService, roadmapService, userService } from '@/services'
import { Role, type ICustomer, type IRoadmap, type IUser } from '@/types'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export type UsersData = Pick<
	IUser,
	'id' | 'lastName' | 'firstName' | 'email' | 'roleId' | 'createdAt'
>
export type CustomersData = Pick<ICustomer, 'id' | 'name' | 'customerUsers' | 'createdAt'>
export type RoadmapsData = Pick<
	IRoadmap,
	'id' | 'name' | 'customerId' | 'customerName' | 'createdAt'
>
export type Node = {
	id: string
	label: string
	type: string
	data?: NodeData
}
//TODO : Refaire le type pour les différentes nodes
export type NodeData = {
	description: string
	duration: number
	progress: number
}

const checkUserIsAdmin = async (): Promise<boolean> => {
	const { getRole } = useAuthStore()
	const isAdmin = (await getRole()).name === Role.Administrator

	return isAdmin
}
export const getUsersData = async (): Promise<Array<UsersData>> => {
	const users = (await userService.getAll({
		select: ['id', 'lastName', 'firstName', 'email', 'roleId', 'createdAt'],
		orderBy: { column: 'email', order: 'asc' }
	})) as Array<UsersData>

	return users
}
export const getCustomersData = async (): Promise<Array<CustomersData>> => {
	const { user } = useAuthStore()
	const isAdmin = await checkUserIsAdmin()

	const customers = (await customerService.getAll({
		select: ['id', 'name', 'logo', 'createdAt'],
		expand: ['CustomerUsers($select=userId)'],
		orderBy: { column: 'name', order: 'asc' },
		filter: isAdmin ? undefined : [`CustomerUsers/any(u:u/UserId eq ${user.id})`]
	})) as Array<CustomersData>

	return customers
}
export const getRoadmapsData = async (): Promise<Array<RoadmapsData>> => {
	const { user } = useAuthStore()
	const isAdmin = await checkUserIsAdmin()

	const roadmaps = (await roadmapService.getAll({
		select: ['id', 'name', 'customerId', 'createdAt'],
		orderBy: { column: 'name', order: 'asc' },
		filter: isAdmin ? undefined : [`Customer/CustomerUsers/any(u:u/UserId eq ${user.id})`]
	})) as Array<RoadmapsData>

	const customerNameRoadmaps = await Promise.all(
		roadmaps.map(async (roadmap) => {
			const customer = (await customerService.getById(roadmap.customerId, {
				select: ['name']
			})) as Pick<ICustomer, 'name'>

			return {
				...roadmap,
				customerName: customer.name
			}
		})
	)

	return customerNameRoadmaps
}
export const getRoadmapData = async (
	id: string,
	nodeType: 'task' | 'deliverable'
): Promise<any> => {
	const roadmap = await roadmapService.getById(id)
	const data = (JSON.parse(roadmap.data) as Array<Node>) ?? []
	const findIfNodeHasParent = (node: any) => {
		const links = data.filter((link: any) => link.target === node.id)
		const parents = links
			.map((link: any) => {
				const parent = data.find((node) => node.id === link.source) as any
				if (parent && parent.type != 'milestone') {
					return parent
				}
			})
			.filter(Boolean)
		return parents
	}
	const table: Array<Array<string>> = []

	data.forEach((element) => {
		if (element.type === 'milestone') {
			table.push([element.id])
		}
	})
	table.forEach((row) => {
		data.forEach((element) => {
			const link = element as any
			if (link.type === 'default' && link.target === row[0]) {
				const i = data.find((node) => node.id === link.source) as any
				row.push(i.id)
				let parents = findIfNodeHasParent(i)
				while (parents.length > 0) {
					const newParents: Array<any> = []
					parents.forEach((parent) => {
						if (parent != undefined) {
							row.push(parent.id)
							newParents.push(...findIfNodeHasParent(parent))
						}
					})
					parents = newParents
				}
			}
		})
	})

	useTableStore().setData(data)

	const finalDataTable: Array<Node> = []

	data
		.filter((node) => node.type === nodeType)
		.forEach((node) => {
			finalDataTable.push({
				id: node.id,
				label: node.label,
				type: node.type,
				...node.data
			})
		})

	return finalDataTable
}

interface State {
	data: Array<Node>
}

export const useTableStore = defineStore('table', {
	state: () =>
		({
			data: []
		}) as State,
	actions: {
		setData(data: Array<Node>) {
			this.data = data
		},
		getData() {
			return this.data
		},
		getTasksData() {
			return this.data.filter((data) => data.type === 'task')
		},
		getDeliverablesData() {
			return this.data.filter((data) => data.type === 'deliverable')
		}
	}
})
