import { h, onMounted, ref } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import router from '@/router'
import { customerService, userService } from '@/services'
import type { ICustomerUser, IGetCustomer } from '@/types'
import { DataTableColumnHeader, DataTableDropDown } from '@/components/ui/datatable'
import { toast } from '@/components/ui/toast'
import CustomerPopover from './CustomerPopover.vue'

export const columns: Array<ColumnDef<IGetCustomer>> = [
	{
		id: 'Nom',
		accessorKey: 'name',
		header: ({ column }) => h(DataTableColumnHeader<IGetCustomer>, { column, title: 'Nom' }),
		cell: ({ row }) => h('div', row.getValue('Nom'))
	},
	{
		id: 'Utilisateurs',
		accessorKey: 'customerUsers',
		header: ({ column }) =>
			h(DataTableColumnHeader<IGetCustomer>, { column, title: 'Utilisateurs' }),
		cell: ({ row }) => h(CustomerPopover, { customerUsers: row.getValue('Utilisateurs') as Array<ICustomerUser> }),
		enableSorting: false
	},
	{
		id: 'Date de création',
		accessorKey: 'createdAt',
		header: ({ column }) =>
			h(DataTableColumnHeader<IGetCustomer>, { column, title: 'Date de création' }),
		cell: ({ row }) => h('div', new Date(row.getValue('Date de création')).toLocaleDateString())
	},
	{
		id: 'Actions',
		cell: ({ row }) =>
			h(
				'div',
				h(DataTableDropDown, {
					name: 'CustomersEdit', id: row.original.id, deleteEntity: async (id: string) => {
						try {
							await customerService.delete(id)

							router.go(0)
						} catch (error) {
							toast({
								title: 'Erreur',
								description: `Nous ne sommes pas parvenus à supprimer ce client.`,
								duration: 5000
							})
						}
					}
				})
			),
		enableHiding: false
	}
]
