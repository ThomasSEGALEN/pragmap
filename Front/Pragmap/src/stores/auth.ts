import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { api } from '@/main'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: useLocalStorage('accessToken', ''),
    refreshToken: useLocalStorage('refreshToken', '')
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
      const { accessToken, refreshToken } = response.data

      this.setToken(accessToken, refreshToken)
    },
    logout() {
      this.clearToken()
    },
    getToken(token: string) {
      return this.$state[token as keyof typeof this.$state]
    },
    setToken(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
    },
    clearToken() {
      this.accessToken = ''
      this.refreshToken = ''
    }
  }
})
