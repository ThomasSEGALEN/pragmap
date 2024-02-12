import { h } from 'vue'
import type { ColumnDef, Row } from '@tanstack/vue-table'
import { useAuthStore } from '@/stores'
import type { IGetCustomer } from '@/types'
import { DataTableColumnHeader, DataTableDropDown } from '@/components/ui/datatable'

export const columns: Array<ColumnDef<IGetCustomer>> = [
	{
		id: 'Nom',
		accessorKey: 'name',
		header: ({ column }) => h(DataTableColumnHeader<IGetCustomer>, { column, title: 'Nom' }),
		cell: ({ row }) => h('div', row.getValue('Nom'))
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
				h(DataTableDropDown, { name: 'CustomersEdit', id: row.original.id, email: row.original.name })
			),
		enableHiding: false
	}
]
