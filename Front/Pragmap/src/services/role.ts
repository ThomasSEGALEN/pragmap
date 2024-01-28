import { api } from '@/main'
import type { IRole } from '@/types'

interface IRoleService<T> {
	getAll(): Promise<Array<T>>
}

class RoleService implements IRoleService<IRole> {
	async getAll(): Promise<Array<IRole>> {
		try {
			const response = await api.get('/role')

			return response.data as Array<IRole>
		} catch (error) {
			throw new Error('GetAll Error')
		}
	}
}

export const roleService = new RoleService()
