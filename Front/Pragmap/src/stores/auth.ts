import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { jwtDecode } from 'jwt-decode'
import { authService, userService } from '@/services'
import type { IAuth, IUser } from '@/types'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: useLocalStorage<Omit<IUser, 'password'> | null>('user', null),
		accessToken: useLocalStorage<string | null>('accessToken', null),
		refreshToken: useLocalStorage<string | null>('refreshToken', null),
	}),
	getters: {
		isAuthenticated: (state) => !!state.accessToken
	},
	actions: {
		async login(email: string, password: string) {
			const { accessToken, refreshToken } = await authService.login(email, password)

			await this.getUser(accessToken)

			this.setToken(accessToken, refreshToken)
		},
		logout() {
			this.user = null
			this.accessToken = null
			this.refreshToken = null
		},
		async getUser(accessToken: string) {
			const userId = jwtDecode<{ nameid: string }>(accessToken).nameid

			this.user = await userService.getById(userId)
		},
		getToken(token: keyof IAuth) {
			return this.$state[token]
		},
		setToken(accessToken: string, refreshToken: string) {
			this.accessToken = accessToken
			this.refreshToken = refreshToken
		},
		async resetToken(token: string) {
			const { accessToken, refreshToken } = await authService.refreshToken(token)

			await this.getUser(accessToken)

			this.setToken(accessToken, refreshToken)
		}
	}
})
