import { customerService, roadmapService, userService } from '@/services'
import type { ICustomer, IRoadmap, IUser } from '@/types'
import { defineStore } from 'pinia'

export type UsersData = Pick<
	IUser,
	'id' | 'lastName' | 'firstName' | 'email' | 'roleId' | 'createdAt'
>
export type CustomersData = Pick<ICustomer, 'id' | 'name' | 'createdAt'>
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
export type NodeData = {
	description: string
	duration: number
	start: boolean
	progress: number
}

export const getUsersData = async (): Promise<Array<UsersData>> => {
	const users = (await userService.getAll({
		select: ['id', 'lastName', 'firstName', 'email', 'roleId', 'createdAt'],
		orderBy: { column: 'email', order: 'asc' }
	})) as Array<UsersData>

	return users
}
export const getCustomersData = async (): Promise<Array<CustomersData>> => {
	const customers = (await customerService.getAll({
		select: ['id', 'name', 'logo', 'createdAt'],
		expand: ['customerUsers($select=userId)'],
		orderBy: { column: 'name', order: 'asc' }
	})) as Array<CustomersData>

	return customers
}
export const getRoadmapsData = async (): Promise<Array<RoadmapsData>> => {
	const roadmaps = (await roadmapService.getAll({
		select: ['id', 'name', 'customerId', 'createdAt'],
		orderBy: { column: 'name', order: 'asc' }
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

	const idTable = table.map((row) => [...new Set(row)])
	const dataTable: Array<Array<Node>> = []

	idTable.forEach((row) => {
		const item = row
			.map((id) => data.find((element) => element.id === id))
			.filter((element): element is Node => element?.type === nodeType)

		dataTable.push(item)
	})

	const flatDataTable = dataTable.flat()
	const finalDataTable: Array<Node> = []

	flatDataTable.forEach((element) => {
		finalDataTable.push({
			id: element.id,
			label: element.label,
			type: element.type,
			...element.data
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
