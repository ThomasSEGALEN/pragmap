import router from "@/router"
import { api } from "@/main"

export interface IBaseService<T, S, U> {
	getAll(): Promise<Array<T>>
	getById(id: string): Promise<T>
	create(data: S): Promise<void>
	update(id: string, data: U): Promise<void>
	delete(id: string): Promise<void>
}

export abstract class BaseService<T, S, U> implements IBaseService<T, S, U> {
	private apiPath: string;
	private routerPath: string;

	constructor(apiPath: string, routerPath: string) {
		this.apiPath = apiPath
		this.routerPath = routerPath
	}

	async getAll(): Promise<Array<T>> {
		const response = await api.get(`/${this.apiPath}`)

		return response.data as Array<T>
	}

	async getById(id: string): Promise<T> {
		const response = await api.get(`/${this.apiPath}(${id})`)

		return response.data as T
	}

	async create(data: S): Promise<void> {
		await api.post(`/${this.apiPath}`, data)

		router.push(`/${this.routerPath}`)
	}

	async update(id: string, data: U): Promise<void> {
		await api.put(`/${this.apiPath}/${id}`, data)

		router.push(`/${this.routerPath}`)
	}

	async delete(id: string): Promise<void> {
		const response = await api.delete(`/${this.apiPath}/${id}`)

		console.log(response)

		router.push(`/${this.routerPath}`)
	}
}
