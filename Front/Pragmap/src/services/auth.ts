import { api } from '@/main'
import router from '@/router'
import { sleep } from '@/lib/utils'
import type { IAuth, IForgotPassword, ILogin, IRefreshToken, IResetPassword } from '@/types'

interface IAuthService {
	login(data: ILogin): Promise<IAuth>
	forgotPassword(data: IForgotPassword): Promise<void>
	resetPassword(data: IResetPassword): Promise<void>
	refreshToken(data: IRefreshToken): Promise<string>
}

class AuthService implements IAuthService {
	public async login(data: ILogin): Promise<IAuth> {
		sleep()

		try {
			const response = await api.post('/auth/login', data)

			return response.data as IAuth
		} catch (error) {
			throw new Error('Login Error')
		}
	}

	public async forgotPassword(data: IForgotPassword): Promise<void> {
		sleep()

		try {
			await api.post('/auth/forgot-password', data)
		} catch (error) {
			throw new Error('ForgotPassword Error')
		}
	}

	public async resetPassword(data: IResetPassword): Promise<void> {
		sleep()

		try {
			await api.post('/auth/reset-password', data)
		} catch (error) {
			throw new Error('ResetPassword Error')
		}

		router.push('/login')
	}

	public async refreshToken(data: IRefreshToken): Promise<string> {
		try {
			const response = await api.post('/auth/refresh-token', data)

			return response.data as string
		} catch (error) {
			throw new Error('RefreshToken Error')
		}
	}
}

export const authService = new AuthService()
