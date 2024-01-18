export interface ICustomer {
  id: string
  name: string
  logo: string
  createdAt: string
  updatedAt: string
  userId: Array<string> // users: Array<IUser>;
}
