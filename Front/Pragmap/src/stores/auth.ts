import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { api } from '@/main'
import type { IUser } from '@/types'
import { jwtDecode } from "jwt-decode"

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: useLocalStorage<Omit<IUser, 'password'>>('user', null),
		accessToken: useLocalStorage('accessToken', '')
	}),
	getters: {
		isAuthenticated: (state) => !!state.accessToken
	},
	actions: {
		async login(email: string, password: string) {
			const response = await api.post('/auth/login', {
				email: email,
				password: password
			})
			const { accessToken } = response.data

			this.accessToken = accessToken

			await this.getUserById(jwtDecode<{ nameid: string; }>(accessToken).nameid)
		},
		logout() {
			this.clearToken()
		},
		async getUserById(id: string) {
			const response = await api.get(`/user/${id}`)

			this.user = response.data.user
		},
		getToken(token: string) {
			return this.$state[token as keyof typeof this.$state]
		},
		clearToken() {
			this.accessToken = ''
		}
	}
})
