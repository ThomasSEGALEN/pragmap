import { api } from "@/main";
import type { IAuth } from "@/types";

class AuthService {
	async login(email: string, password: string): Promise<IAuth> {
		const response = await api.post('/auth/login', {
			email: email,
			password: password
		})

		return response.data as IAuth
	}

	async refreshToken(refreshToken: string): Promise<IAuth> {
		const response = await api.get(`/auth/refreshToken/${refreshToken}`)

		return response.data as IAuth
	}
}

export const authService = new AuthService()
