import { api } from '@/main'
import type { IAuth, IForgotPassword, ILogin, IResetPassword } from '@/types'

interface IAuthService {
	login(data: ILogin): Promise<IAuth>
	forgotPassword(data: IForgotPassword): Promise<void>
	resetPassword(data: IResetPassword): Promise<void>
	refreshToken(refreshToken: string): Promise<IAuth>
}

class AuthService implements IAuthService {
	public async login(data: ILogin): Promise<IAuth> {
		try {
			const response = await api.post('/auth/login', data)

			return response.data as IAuth
		} catch (error) {
			throw new Error('Login Error')
		}
	}

	public async forgotPassword(data: IForgotPassword): Promise<void> {
		try {
			await api.post('/auth/forgot-password', data)
		} catch (error) {
			throw new Error('ForgotPassword Error')
		}
	}

	public async resetPassword(data: IResetPassword): Promise<void> {
		try {
			await api.post('/auth/reset-password', data)
		} catch (error) {
			throw new Error('ResetPassword Error')
		}
	}

	public async refreshToken(refreshToken: string): Promise<IAuth> {
		try {
			const response = await api.get(`/auth/refreshToken/${refreshToken}`)

			return response.data as IAuth
		} catch (error) {
			throw new Error('RefreshToken Error')
		}
	}
}

export const authService = new AuthService()
