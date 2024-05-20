import '@/assets/main.css'
import axios from 'axios'
import VueApexCharts from "vue3-apexcharts"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(VueApexCharts);
app.mount('#app')

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	}
})

const { isAuthenticated, logout, getToken, resetToken } = useAuthStore()

api.interceptors.request.use(async (request) => {
	if (isAuthenticated) {
		request.headers.Authorization = `Bearer ${await getToken('accessToken')}`
	}

	return request
})

api.interceptors.response.use(
	(response) => {
		return response
	},
	async (error) => {
		if (error.response.status === 400) {
			throw new Error('400 Bad Request')
		}
		if (error.response.status === 401) {
			router.push('/')

			throw new Error('401 Unauthorized')
		}
		if (error.response.status === 404) {
			throw new Error('404 Not Found')
		}
		if (error.response.status === 498) {
			const refreshToken = await getToken('refreshToken')

			if (!refreshToken) {
				logout()

				router.push('/login')

				throw new Error('498 Invalid Token')
			}

			await resetToken(refreshToken)
		}
		if (error.response.status === 500) {
			throw new Error('500 Internal Server Error')
		}

		return Promise.reject(error)
	}
)
