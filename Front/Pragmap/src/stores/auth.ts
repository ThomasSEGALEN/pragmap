import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { jwtDecode } from 'jwt-decode'
import { authService, roleService, userService } from '@/services'
import type { IAuth, IGetUser, IRole } from '@/types'

interface State {
	user: IGetUser,
	roles: Array<IRole>,
	accessToken: string,
	refreshToken: string,
}

export const useAuthStore = defineStore('auth', {
	state: () => useLocalStorage<State>('authStore', {
		user: {} as IGetUser,
		roles: [],
		accessToken: "",
		refreshToken: ""
	}),
	getters: {
		isAuthenticated: (state) => !!state.accessToken
	},
	actions: {
		async login(email: string, password: string) {
			const { accessToken, refreshToken } = await authService.login(email, password)

			await this.getUser(accessToken)
			await this.getRoles()

			this.setToken(accessToken, refreshToken)
		},
		logout() {
			this.$state.user = {} as IGetUser
			this.$state.roles = []
			this.$state.accessToken = ""
			this.$state.refreshToken = ""
		},
		async getUser(accessToken: string) {
			const userId = jwtDecode<{ nameid: string }>(accessToken).nameid

			this.$state.user = await userService.getById(userId, { select: ['id', 'lastName', 'firstName', 'email', 'roleId'] })
		},
		async getRoles() {
			this.$state.roles = await roleService.getAll()
		},
		getToken(token: keyof IAuth) {
			return this.$state[token]
		},
		setToken(accessToken: string, refreshToken: string) {
			this.$state.accessToken = accessToken
			this.$state.refreshToken = refreshToken
		},
		async resetToken(token: string) {
			const { accessToken, refreshToken } = await authService.refreshToken(token)

			await this.getUser(accessToken)

			this.setToken(accessToken, refreshToken)
		}
	}
})
