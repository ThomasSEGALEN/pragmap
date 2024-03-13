export interface IUser {
	id: string
	lastName: string
	firstName: string
	email: string
	password: string
	createdAt: string
	updatedAt: string
	refreshToken: string | null
	refreshTokenExpiresAt: string | null
	roleId: string
}

export interface IGetUser {
	id: string
	lastName: string
	firstName: string
	email: string
	createdAt: string
	refreshToken: string | null
	roleId: string
}

export interface IPostUser {
	lastName: string
	firstName: string
	email: string
	password: string
	passwordConfirmation: string
	roleId: string
}

export interface IPutUser {
	id: string
	lastName: string
	firstName: string
	email: string
	roleId: string
}
