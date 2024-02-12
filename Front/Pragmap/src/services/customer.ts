import { BaseService } from '@/services'
import type { ICustomer, IGetCustomer, IPostCustomer, IPutCustomer } from '@/types'

class CustomerService extends BaseService<ICustomer, IGetCustomer, IPostCustomer, IPutCustomer> { }

export const customerService = new CustomerService('customer')
