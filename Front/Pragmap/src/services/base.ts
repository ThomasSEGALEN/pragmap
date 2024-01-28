import { api } from "@/main"
import type { IUser } from "@/types"

export interface IApiOptions<T> {
	select?: Array<keyof T>
	expand?: Array<string>
	filter?: Array<string>
	top?: number
	skip?: number
	orderBy?: keyof T & string
}

export const applyOptions = <T>(options?: IApiOptions<T>): string => {
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

interface IBaseService<T, S, U> {
	getAll(options: IApiOptions<IUser>): Promise<Array<T>>
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

	async getAll(options?: IApiOptions<IUser>): Promise<Array<T>> {
		try {
			const response = await api.get(`/${this.apiPath}${options ? applyOptions(options) : ''}`)

			return response.data.value as Array<T>
		} catch (error) {
			throw new Error('GetAll Error')
		}
	}

	async getById(id: string, options?: IApiOptions<IUser>): Promise<T> {
		try {
			const response = await api.get(`/${this.apiPath}/${id}${options ? applyOptions(options) : ''}`)

			return response.data as T
		} catch (error) {
			throw new Error('GetById Error')
		}
	}

	async create(data: S): Promise<void> {
		try {
			await api.post(`/${this.apiPath}`, data)
		} catch (error) {
			throw new Error('Create Error')
		}
	}

	async update(id: string, data: U): Promise<void> {
		try {
			await api.put(`/${this.apiPath}/${id}`, data)
		} catch (error) {
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
