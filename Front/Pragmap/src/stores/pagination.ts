import { defineStore } from 'pinia'
import { customerService, userService } from '@/services'
import type { ICustomer, IGetCustomer, IGetUser, IUser } from '@/types'

interface State {
	pageSize: number
	pageCount: number
	pageIndex: number
}

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
		async getUsersData(): Promise<Array<IGetUser>> {
			const count = (await userService.getAll({ count: true })) as number
			const users = (await userService.getAll({
				select: ['id', 'lastName', 'firstName', 'email', 'roleId', 'createdAt'],
				top: this.pageSize,
				skip: this.pageSize * this.pageIndex,
				orderBy: { column: 'createdAt', order: 'asc' }
			})) as Array<IUser>

			this.setPageCount(Math.ceil(count / this.pageSize))

			return users
		},
		async getCustomersData(): Promise<Array<IGetCustomer>> {
			const count = (await customerService.getAll({ count: true })) as number
			const customers = (await customerService.getAll({
				select: ['id', 'name', 'createdAt'],
				expand: ['customerUsers($select=userId)'],
				top: this.pageSize,
				skip: this.pageSize * this.pageIndex,
				orderBy: { column: 'createdAt', order: 'asc' }
			})) as Array<ICustomer>

			this.setPageCount(Math.ceil(count / this.pageSize))

			return customers
		}
	}
})
