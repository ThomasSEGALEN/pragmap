import { api } from "@/main";
import type { IAuth } from "@/types";

class AuthService {
	async login(email: string, password: string): Promise<IAuth> {
		try {
			const response = await api.post('/auth/login', {
				email: email,
				password: password
			})

			return response.data as IAuth
		} catch (error) {
			throw new Error('Login Error')
		}
	}

	async forgotPassword(email: string): Promise<void> {
		try {
			await api.post('/auth/forgot-password', {
				email: email
			})
		} catch (error) {
			throw new Error('ForgotPassword Error')
		}
	}

	async resetPassword(token: string, password: string): Promise<void> {
		try {
			await api.post('/auth/reset-password', {
				token: token,
				password: password
			})
		} catch (error) {
			throw new Error('ResetPassword Error')
		}
	}

	async refreshToken(refreshToken: string): Promise<IAuth> {
		try {
			const response = await api.get(`/auth/refreshToken/${refreshToken}`)

			return response.data as IAuth
		} catch (error) {
			throw new Error('RefreshToken Error')
		}
	}
}

export const authService = new AuthService()
