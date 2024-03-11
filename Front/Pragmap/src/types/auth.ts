export interface IAuth {
	accessToken: string
	refreshToken: string
}

export interface ILogin {
	email: string
	password: string
}

export interface IForgotPassword {
	email: string
}

export interface IResetPassword {
	token: string
	password: string
}

export interface IRefreshToken {
	refreshToken: string
}
