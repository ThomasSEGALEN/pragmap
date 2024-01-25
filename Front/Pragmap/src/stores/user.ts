import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { userService } from '@/services'
import type { IUser } from '@/types'

interface State {
	editUser: Omit<IUser, 'password'> | null
}

export const useUserStore = defineStore('user', {
	state: () => useLocalStorage<State>('userStore', {
		editUser: null
	}),
	actions: {
		async getEditUserById(id: string) {
			const user = await userService.getById(id)

			this.editUser = user
		}
	}
})
