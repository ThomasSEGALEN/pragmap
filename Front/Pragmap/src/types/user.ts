import type { ICustomer, IRole } from "@/types"

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
	role: IRole;
	customers: Array<ICustomer>
}

export interface IPostUser extends Pick<IUser, 'lastName' | 'firstName' | 'email' | 'password' | 'role'> { }

export interface IPutUser extends Pick<IUser, 'lastName' | 'firstName' | 'email' | 'role'> { }
