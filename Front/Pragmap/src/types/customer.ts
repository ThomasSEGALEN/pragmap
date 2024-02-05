import type { nullable } from "zod"

export interface ICustomer {
	id: string
	name: string
	logo: string
	userIds: string[]
	createdAt: string
	updatedAt: string
}
export interface IGetCustomer {
	id: string
	name: string
	logo?: string 
	userIds: string[]
	createdAt: string
	updatedAt: string
}
export interface IPostCustomer {
	name: string
	logo?: string 
	// userIds: string[]
}
export interface IPutCustomer {
	id: string
	name: string
	logo?: string
	userIds: string[]
	createdAt: string
	updatedAt: string
}
export interface IDisplayCustomer {
	id: string
	name: string
	logo?: string
	userIds: string[]
	createdAt: string
	updatedAt: string
}
