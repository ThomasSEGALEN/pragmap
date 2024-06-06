import type { ICustomerUser } from './customerUser'

export interface ICustomer {
	id: string
	name: string
	logo: string | null
	userIds: Array<string> | []
	createdAt: string
	updatedAt: string
	customerUsers: Array<ICustomerUser> | []
}
export interface IGetCustomer {
	id: string
	name: string
	logo: string | null
	createdAt: string
	customerUsers: Array<ICustomerUser> | []
}
export interface IPostCustomer {
	name: string
	logo: string | null
	userIds: Array<string> | []
}
export interface IPutCustomer {
	id: string
	name: string
	logo: string | null
	userIds: Array<string> | []
}
