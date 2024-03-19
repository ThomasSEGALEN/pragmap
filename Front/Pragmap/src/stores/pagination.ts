import { defineStore } from 'pinia'
import { customerService, roadmapService, userService } from '@/services'
import type { ICustomer, IRoadmap, IUser } from '@/types'

interface State {
	pageSize: number
	pageCount: number
	pageIndex: number
}

export type UsersData = Pick<
	IUser,
	'id' | 'lastName' | 'firstName' | 'email' | 'roleId' | 'createdAt'
>
export type CustomersData = Pick<ICustomer, 'id' | 'name' | 'createdAt'>
export type RoadmapsData = Pick<
	IRoadmap,
	'id' | 'name' | 'customerId' | 'customerName' | 'createdAt'
>

export const usePaginationStore = defineStore('pagination', {
	state: (): State => ({
		pageSize: 10,
		pageCount: 1,
		pageIndex: 0
	}),
	actions: {
		getPageCount(): number {
			return this.pageCount
		},
		getPageIndex(): number {
			return this.pageIndex
		},
		getPageSize(): number {
			return this.pageSize
		},
		setPageSize(pageSize: number): void {
			this.pageSize = pageSize
		},
		setPageCount(pageCount: number): void {
			this.pageCount = pageCount
		},
		setPageIndex(pageIndex: number): void {
			this.pageIndex = pageIndex
		},
		previousPage(): void {
			this.setPageIndex(this.pageIndex - 1)
		},
		nextPage(): void {
			this.setPageIndex(this.pageIndex + 1)
		},
		getCanPreviousPage(): boolean {
			return this.pageIndex > 0
		},
		getCanNextPage(): boolean {
			return this.pageIndex < this.pageCount - 1
		},
		async getUsersData(): Promise<Array<UsersData>> {
			const count = (await userService.getAll({ count: true })) as number
			const users = (await userService.getAll({
				select: ['id', 'lastName', 'firstName', 'email', 'roleId', 'createdAt'],
				top: this.pageSize,
				skip: this.pageSize * this.pageIndex,
				orderBy: { column: 'email', order: 'asc' }
			})) as Array<UsersData>

			this.setPageCount(Math.ceil(count / this.pageSize))

			return users
		},
		async getCustomersData(): Promise<Array<CustomersData>> {
			const count = (await customerService.getAll({ count: true })) as number
			const customers = (await customerService.getAll({
				select: ['id', 'name', 'logo', 'createdAt'],
				expand: ['customerUsers($select=userId)'],
				top: this.pageSize,
				skip: this.pageSize * this.pageIndex,
				orderBy: { column: 'name', order: 'asc' }
			})) as Array<CustomersData>

			this.setPageCount(Math.ceil(count / this.pageSize))

			return customers
		},
		async getRoadmapsData(): Promise<Array<RoadmapsData>> {
			const count = (await roadmapService.getAll({ count: true })) as number
			const roadmaps = (await roadmapService.getAll({
				select: ['id', 'name', 'customerId', 'createdAt'],
				top: this.pageSize,
				skip: this.pageSize * this.pageIndex,
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

			this.setPageCount(Math.ceil(count / this.pageSize))

			return customerNameRoadmaps
		}
	}
})
