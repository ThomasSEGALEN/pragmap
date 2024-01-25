import { api } from '@/main'
import type { IRole } from '@/types'

export interface IRoleService<T> {
	getAll(): Promise<Array<T>>
}

class RoleService implements IRoleService<IRole> {
	async getAll(): Promise<Array<IRole>> {
		try {
			const response = await api.get('/role')

			return response.data as Array<IRole>
		} catch (error) {
			console.error(error)

			throw new Error('GetAll Error')
		}
	}
}

export const roleService = new RoleService()
