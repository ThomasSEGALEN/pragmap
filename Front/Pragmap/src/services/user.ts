import { api } from '@/main'
import { BaseService } from '@/services'
import type { IGetUser, IPostUser, IPutUser, IUser } from '@/types'

class UserService extends BaseService<IUser, IGetUser, IPostUser, IPutUser> {
  public async askEmailUpdate(userId: string, email: string): Promise<void> {
    try {
      await api.post('/user/ask-email-update', {
        userId: userId,
        email: email
      })
    } catch (error) {
      throw new Error('AskEmailUpdate Error')
    }
  }
}

export const userService = new UserService('user')
