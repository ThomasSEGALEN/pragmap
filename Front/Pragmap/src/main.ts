import '@/assets/main.css'
import axios from 'axios'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

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
			authStore.logout()
			router.push('/login')

			throw new Error('401 Unauthorized')
		}
	}
)
