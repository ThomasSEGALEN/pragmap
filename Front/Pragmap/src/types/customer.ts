import type { ICustomerUser } from './customerUser'

export interface ICustomer {
	id: string
	name: string
	logo: string
	userIds: Array<string> | []
	createdAt: string
	updatedAt: string
	customerUsers: Array<ICustomerUser> | []
}
export interface IGetCustomer {
	id: string
	name: string
	logo: string
	createdAt: string
	customerUsers: Array<ICustomerUser> | []
}
export interface IPostCustomer {
	name: string
	logo: string
	userIds: Array<string> | []
}
export interface IPutCustomer {
	id: string
	name: string
	logo: string
	userIds: Array<string> | []
}
