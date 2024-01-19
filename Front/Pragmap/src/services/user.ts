import { BaseService } from '@/services'
import type { IPostUser, IPutUser, IUser } from '@/types'

class UserService extends BaseService<IUser, IPostUser, IPutUser> {
	constructor() {
		super('user', 'users')
	}
}

export const userService = new UserService()
