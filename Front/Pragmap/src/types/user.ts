import type { ICustomer } from "@/types"

export interface IUser {
	id: string
	lastName: string
	firstName: string
	email: string
	password: string
	createdAt: string
	updatedAt: string
	refreshToken: string
	refreshTokenExpiresAt: string
	role: string
	customers: Array<ICustomer>
}

export interface IPostUser {
	lastName: string
	firstName: string
	email: string
	password: string
	role: {
		id: string
		name: string
	}
}

export interface IPutUser {
	lastName: string
	firstName: string
	email: string
	password?: string
	role: string
}

export interface IDisplayUser {
	id: string
	lastName: string
	firstName: string
	email: string
	role: string
}
