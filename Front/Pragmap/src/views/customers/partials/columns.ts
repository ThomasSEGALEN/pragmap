import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { customerService } from '@/services'
import type { CustomersData } from '@/stores'
import { type ICustomerUser } from '@/types'
import { DataTableColumnHeader, DataTableAction } from '@/components/ui/datatable'
import { toast } from '@/components/ui/toast'
import UsersPopover from './UsersPopover.vue'
import logoPlaceholder from '@/assets/logo-placeholder.png'

export const columns: Array<ColumnDef<CustomersData>> = [
	{
		id: 'Nom',
		accessorKey: 'name',
		header: ({ column }) => h(DataTableColumnHeader<CustomersData>, { column, title: 'Nom' }),
		cell: ({ row }) => h('div', row.getValue('Nom'))
	},
	{
		id: 'Logo',
		accessorKey: 'logo',
		header: ({ column }) => h(DataTableColumnHeader<CustomersData>, { column, title: 'Logo' }),
		cell: ({ row }) =>
			row.getValue('Logo')
				? h('img', {
						class: 'h-24 w-24 object-cover',
						src: row.getValue('Logo'),
						alt: `Logo de ${row.getValue('Nom')}`
					})
				: h('img', {
						class: 'h-24 w-24 object-cover',
						src: logoPlaceholder,
						alt: `Logo de ${row.getValue('Nom')}`
					}),
		enableSorting: false
	},
	{
		id: 'Utilisateurs',
		accessorKey: 'users',
		header: ({ column }) =>
			h(DataTableColumnHeader<CustomersData>, { column, title: 'Utilisateurs' }),
		cell: ({ row }) =>
			h(UsersPopover, { customerUsers: row.original.customerUsers as Array<ICustomerUser> }),
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
		accessorKey: 'actions',
		header: ({ column }) => h(DataTableColumnHeader<CustomersData>, { column, title: 'Actions' }),
		cell: ({ row }) =>
			h(DataTableAction, {
				name: 'CustomersEdit',
				id: row.original.id,
				customerId: row.original.id as string,
				deleteEntity: async (id: string) => {
					try {
						await customerService.delete(id)
					} catch (error) {
						toast({
							title: 'Erreur',
							description: 'Nous ne sommes pas parvenus à supprimer ce client.',
							duration: 5000
						})
					}
				}
			}),
		enableSorting: false,
		enableHiding: false
	}
]
