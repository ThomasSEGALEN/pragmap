export interface IUser {
	id: string;
	lastName: string;
	firstName: string;
	email: string;
	password: string;
	createdAt: string;
	updatedAt: string;
	refreshToken: string;
	refreshTokenExpiresAt: string;
	roleId: string; // role: IRole;
	customerId: Array<string>; // customers: Array<ICustomer>
}
