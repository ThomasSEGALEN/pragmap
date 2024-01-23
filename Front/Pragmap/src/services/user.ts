import { BaseService } from '@/services'
import type { IPostUser, IPutUser, IUser } from '@/types'

class UserService extends BaseService<IUser, IPostUser, IPutUser> { }

export const userService = new UserService('user')
