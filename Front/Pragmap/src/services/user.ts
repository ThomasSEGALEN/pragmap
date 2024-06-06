import { api } from '@/main'
import router from '@/router'
import { sleep } from '@/lib/utils'
import { BaseService } from '@/services'
import { type IGetUser, type IPostUser, type IPutUser, type IUser } from '@/types'

class UserService extends BaseService<IUser, IGetUser, IPostUser, IPutUser> {
	public async askEmailUpdate(data: { userId: string; email: string }): Promise<void> {
		await sleep()

		try {
			await api.post(`/${this.apiPath}/ask-email-update`, data)
		} catch (error) {
			throw new Error('AskEmailUpdate Error')
		}
	}

	public async updateEmail(token: string): Promise<void> {
		try {
			await api.post(`/${this.apiPath}/update-email?token=${token}`)
		} catch (error) {
			throw new Error('UpdateEmail Error')
		}
	}

	public async updatePassword(data: {
		userId: string
		oldPassword: string
		newPassword: string
	}): Promise<void> {
		await sleep()

		try {
			await api.put(`/${this.apiPath}/${data.userId}/update-password`, data)
		} catch (error) {
			throw new Error('UpdatePassword Error')
		}

		router.push('/logout')
	}
}

export const userService = new UserService('user')
