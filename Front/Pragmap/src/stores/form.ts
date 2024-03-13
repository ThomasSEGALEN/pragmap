import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { customerService, roadmapService, userService } from '@/services'
import type { IGetCustomer, IGetRoadmap, IGetUser } from '@/types'

interface State {
	editUser: IGetUser | null
	editCustomer: IGetCustomer | null
	editRoadmap: IGetRoadmap | null
}

export const useFormStore = defineStore('form', {
	state: () =>
		useLocalStorage<State>('formStore', {
			editCustomer: null,
			editRoadmap: null,
			editUser: null
		}),
	actions: {
		clearEdit(): void {
			this.$state.editUser = null
			this.$state.editCustomer = null
			this.$state.editRoadmap = null
		},
		async getEditUserById(id: string): Promise<void> {
			const user = await userService.getById(id, {
				select: ['id', 'lastName', 'firstName', 'email', 'roleId']
			})

			this.$state.editUser = user
		},
		async getEditCustomerById(id: string): Promise<void> {
			const customer = await customerService.getById(id, {
				select: ['id', 'name', 'logo'],
				expand: ['customerUsers($select=userId)']
			})

			this.$state.editCustomer = customer
		},
		async getEditRoadmapById(id: string): Promise<void> {
			const roadmap = await roadmapService.getById(id, {
				select: ['id', 'name', 'data']
			})

			this.$state.editRoadmap = roadmap
		}
	}
})
