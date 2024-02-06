import { BaseService } from '@/services'
import type { IGetUser, IPostUser, IPutUser, IUser } from '@/types'

class UserService extends BaseService<IUser, IGetUser, IPostUser, IPutUser> {}

export const userService = new UserService('user')
