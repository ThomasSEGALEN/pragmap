import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { jwtDecode } from 'jwt-decode'
import { authService, roleService, userService } from '@/services'
import type { IAuth, IGetUser, ILogin, IRole } from '@/types'

interface State {
	user: IGetUser
	roles: Array<IRole>
	accessToken: string
}

export const useAuthStore = defineStore('auth', {
	state: () =>
		useLocalStorage<State>('authStore', {
			user: {} as IGetUser,
			roles: [],
			accessToken: ''
		}),
	getters: {
		isAuthenticated: (state) => !!state.accessToken
	},
	actions: {
		async login(data: ILogin): Promise<void> {
			const { accessToken } = await authService.login(data)

			this.setToken(accessToken)

			await this.getUser(accessToken)
			await this.getRoles()
		},
		logout(): void {
			this.$state.user = {} as IGetUser
			this.$state.roles = []
			this.$state.accessToken = ''
		},
		async getUser(accessToken: string): Promise<void> {
			const userId = jwtDecode<{ nameid: string }>(accessToken).nameid

			this.$state.user = await userService.getById(userId, {
				select: ['id', 'lastName', 'firstName', 'email', 'roleId']
			})
		},
		async getRoles(): Promise<void> {
			this.$state.roles = await roleService.getAll()
		},
		async getToken(token: keyof IAuth): Promise<string> {
			if (token === 'accessToken') return this.$state[token]

			const user = await userService.getById(this.$state.user.id, {
				select: [token]
			})

			return user.refreshToken
		},
		setToken(token: string): void {
			this.$state.accessToken = token
		},
		async resetToken(token: string): Promise<void> {
			const data = {
				refreshToken: token
			}
			const accessToken = await authService.refreshToken(data)

			this.setToken(accessToken)

			await this.getUser(accessToken)
		}
	}
})
