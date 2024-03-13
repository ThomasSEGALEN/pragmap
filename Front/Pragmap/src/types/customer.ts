import type { ICustomerUser } from './customerUser'

export interface ICustomer {
	id: string
	name: string
	logo: string
	userIds: Array<string | null>
	createdAt: string
	updatedAt: string
	customerUsers: Array<ICustomerUser> | null
}
export interface IGetCustomer {
	id: string
	name: string
	logo: string
	createdAt: string
	customerUsers: Array<ICustomerUser> | null
}
export interface IPostCustomer {
	name: string
	logo: string
	userIds: Array<string | null>
}
export interface IPutCustomer {
	id: string
	name: string
	logo: string
	userIds: Array<string | null>
}
