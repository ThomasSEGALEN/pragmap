import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { userService } from '@/services'
import type { IGetUser } from '@/types'

interface State {
	editUser: IGetUser | null
}

export const useUserStore = defineStore('user', {
	state: () =>
		useLocalStorage<State>('userStore', {
			editUser: null
		}),
	actions: {
		async getEditUserById(id: string): Promise<void> {
			const user = await userService.getById(id, {
				select: ['id', 'lastName', 'firstName', 'email', 'roleId']
			})

			this.$state.editUser = user
		},
		clearEditUser(): void {
			this.$state.editUser = null
		}
	}
})
