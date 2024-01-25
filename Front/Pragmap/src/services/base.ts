import { api } from "@/main"
import type { IDisplayUser } from "@/types"

// interface OData<TValue> {
// 	value: TValue
// }

interface GetAllOptions {
	select?: Array<keyof IDisplayUser>
	expand?: Array<string>
	filter?: Array<string>
	top?: number
	skip?: number
	orderBy?: keyof IDisplayUser
}

export interface IBaseService<T, S, U> {
	getAll(options: GetAllOptions): Promise<Array<T>>
	getById(id: string): Promise<T>
	create(data: S): Promise<void>
	update(id: string, data: U): Promise<void>
	delete(id: string): Promise<void>
}

export abstract class BaseService<T, S, U> implements IBaseService<T, S, U> {
	private apiPath: string;

	constructor(apiPath: string) {
		this.apiPath = apiPath
	}

	private applyOptions(options?: GetAllOptions): string {
		let parameters = '?'

		if (options) {
			if (options.select) {
				parameters += `$select=${options.select.join(',')}&`
			}
			if (options.expand) {
				parameters += `$expand=${options.expand.join(',')}&`
			}
			if (options.filter) {
				parameters += `$filter=${options.filter.join(',')}&`
			}
			if (options.top) {
				parameters += `$top=${options.top}&`
			}
			if (options.skip) {
				parameters += `$skip=${options.skip}&`
			}
			if (options.orderBy) {
				parameters += `$orderBy=${options.orderBy}`
			}
		}

		return parameters
	}

	async getAll(options?: GetAllOptions): Promise<Array<T>> {
		try {
			const response = await api.get(`/${this.apiPath}${options ? this.applyOptions(options) : null}`)

			return response.data.value as Array<T>
		} catch (error) {
			console.error('GetAll Error: ', error)

			throw new Error('GetAll Error')
		}
	}

	async getById(id: string): Promise<T> {
		try {
			const response = await api.get(`/${this.apiPath}/${id}`)

			return response.data as T
		} catch (error) {
			console.error('GetById Error: ', error)

			throw new Error('GetById Error')
		}
	}

	async create(data: S): Promise<void> {
		try {
			await api.post(`/${this.apiPath}`, data)
		} catch (error) {
			console.error('Create Error: ', error)

			throw new Error('Create Error')
		}
	}

	async update(id: string, data: U): Promise<void> {
		try {
			await api.put(`/${this.apiPath}/${id}`, data)
		} catch (error) {
			console.error('Update Error: ', error)

			throw new Error('Update Error')
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await api.delete(`/${this.apiPath}/${id}`)
		} catch (error) {
			console.error('Delete Error: ', error)

			throw new Error('Delete Error')
		}
	}
}
