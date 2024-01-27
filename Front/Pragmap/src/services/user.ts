import { BaseService } from '@/services'
import type { IGetUser, IPostUser, IPutUser } from '@/types'

class UserService extends BaseService<IGetUser, IPostUser, IPutUser> { }

export const userService = new UserService('user')
