import { BaseService } from '@/services'
import type { IGetCustomer, IPostCustomer, IPutCustomer } from '@/types'

class CustomerService extends BaseService<IGetCustomer, IPostCustomer, IPutCustomer> { }

export const customerService = new CustomerService('customer')
