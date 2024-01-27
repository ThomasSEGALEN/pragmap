import '@/assets/main.css'
import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '@/App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})

const authStore = useAuthStore()

api.interceptors.request.use((request) => {
	if (authStore.isAuthenticated) {
		request.headers.Authorization = `Bearer ${authStore.getToken('accessToken')}`
	}

	return request
})

api.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response.status === 400) {
			throw new Error('400 Bad Request')
		}
		if (error.response.status === 401) {
			const refreshToken = authStore.getToken('refreshToken')

			if (!refreshToken) {
				authStore.logout()
				router.push('/login')

				throw new Error('401 Unauthorized')
			}

			authStore.resetToken(refreshToken)
		}
		if (error.response.status === 404) {
			throw new Error('404 Not Found')
		}
		if (error.response.status === 500) {
			throw new Error('500 Internal Server Error')
		}

		return Promise.reject(error);
	}
)
