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
	roleId: string
}

export interface IGetUser {
	id: string
	lastName: string
	firstName: string
	email: string
	roleId: string
	createdAt: string
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
