import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import router from '@/router'
import { customerService } from '@/services'
import type { CustomersData } from '@/stores'
import type { ICustomerUser } from '@/types'
import { DataTableColumnHeader, DataTableDropDown } from '@/components/ui/datatable'
import { toast } from '@/components/ui/toast'
import UsersPopover from './UsersPopover.vue'

export const columns: Array<ColumnDef<CustomersData>> = [
	{
		id: 'Logo',
		accessorKey: 'logo',
		header: ({ column }) => h(DataTableColumnHeader<CustomersData>, { column, title: 'Logo' }),
		cell: ({ row }) =>
			h('img', {
				class: 'h-24 w-24 object-cover',
				src: row.getValue('Logo'),
				alt: `Logo de ${row.getValue('Nom')}`
			}),
		enableSorting: false
	},
	{
		id: 'Nom',
		accessorKey: 'name',
		header: ({ column }) => h(DataTableColumnHeader<CustomersData>, { column, title: 'Nom' }),
		cell: ({ row }) => h('div', row.getValue('Nom'))
	},
	{
		id: 'Utilisateurs',
		accessorKey: 'customerUsers',
		header: ({ column }) =>
			h(DataTableColumnHeader<CustomersData>, { column, title: 'Utilisateurs' }),
		cell: ({ row }) =>
			h(UsersPopover, { customerUsers: row.getValue('Utilisateurs') as Array<ICustomerUser> }),
		enableSorting: false
	},
	{
		id: 'Date de création',
		accessorKey: 'createdAt',
		header: ({ column }) =>
			h(DataTableColumnHeader<CustomersData>, { column, title: 'Date de création' }),
		cell: ({ row }) => h('div', new Date(row.getValue('Date de création')).toLocaleDateString())
	},
	{
		id: 'Actions',
		cell: ({ row }) =>
			h(DataTableDropDown, {
				name: 'CustomersEdit',
				id: row.original.id,
				deleteEntity: async (id: string) => {
					try {
						await customerService.delete(id)

						router.go(0)
					} catch (error) {
						toast({
							title: 'Erreur',
							description: 'Nous ne sommes pas parvenus à supprimer ce client.',
							duration: 5000
						})
					}
				}
			}),
		enableHiding: false
	}
]
