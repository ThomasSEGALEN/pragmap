import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { customerService } from '@/services'
import type { IGetCustomer } from '@/types'

interface State {
	editCustomer: IGetCustomer | null
}

export const useCustomerStore = defineStore('customer', {
	state: () =>
		useLocalStorage<State>('customerStore', {
			editCustomer: null
		}),
	actions: {
		async getEditCustomerById(id: string): Promise<void> {
			const customer = await customerService.getById(id, {
				select: ['id', 'name', 'logo'],
				expand: ['customerUsers($select=userId)']
			})

			this.$state.editCustomer = customer
		},
		clearEditCustomer(): void {
			this.$state.editCustomer = null
		}
	}
})
