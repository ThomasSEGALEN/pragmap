import { api } from '@/main'

export interface IApiOptions<T> {
	select?: Array<keyof T>
	expand?: Array<string>
	filter?: Array<string>
	top?: number
	skip?: number
	orderBy?: {
		column: keyof T & string
		order: 'asc' | 'desc'
	}
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
			parameters += `$orderBy=${options.orderBy.column} ${options.orderBy.order}`
		}
	}

	return parameters
}

interface IBaseService<T, S, U, V> {
	getCount(options?: IApiOptions<T>): Promise<number>
	getAll(options: IApiOptions<T>): Promise<Array<T>>
	getById(id: string): Promise<S>
	create(data: U): Promise<void>
	update(id: string, data: V): Promise<void>
	delete(id: string): Promise<void>
}

export abstract class BaseService<T, S, U, V> implements IBaseService<T, S, U, V> {
	private apiPath: string

	constructor(apiPath: string) {
		this.apiPath = apiPath
	}

	public async getCount(options?: IApiOptions<T>): Promise<number> {
		try {
			const response = await api.get(
				`/${this.apiPath}/$count${options ? applyOptions(options) : ''}`
			)

			return response.data as number
		} catch (error) {
			throw new Error('Count Error')
		}
	}

	public async getAll(options?: IApiOptions<T>): Promise<Array<T>> {
		try {
			const response = await api.get(`/${this.apiPath}${options ? applyOptions(options) : ''}`)

			return response.data.value as Array<T>
		} catch (error) {
			throw new Error('GetAll Error')
		}
	}

	public async getById(id: string, options?: IApiOptions<S>): Promise<S> {
		try {
			const response = await api.get(
				`/${this.apiPath}/${id}${options ? applyOptions(options) : ''}`
			)

			return response.data as S
		} catch (error) {
			throw new Error('GetById Error')
		}
	}

	public async create(data: U): Promise<void> {
		try {
			console.log(data)
			await api.post(`/${this.apiPath}`, data)
		} catch (error) {
			throw new Error('Create Error')
		}
	}

	public async update(id: string, data: V): Promise<void> {
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
			throw new Error('Delete Error')
		}
	}
}