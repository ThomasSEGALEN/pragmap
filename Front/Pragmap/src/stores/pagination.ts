import { defineStore } from 'pinia'
import { userService } from '@/services'
import type { IGetUser } from '@/types'

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
    async getData(): Promise<Array<IGetUser>> {
      const count = await userService.getCount()
      const users = await userService.getAll({
        select: ['id', 'lastName', 'firstName', 'email', 'roleId', 'createdAt'],
        top: this.pageSize,
        skip: this.pageSize * this.pageIndex,
        orderBy: { column: 'createdAt', order: 'asc' }
      })

      this.setPageCount(Math.ceil(count / this.pageSize))

      return users
    }
  }
})
