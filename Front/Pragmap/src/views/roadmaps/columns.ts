import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { IGetRoadMap } from '@/types'
import { DataTableColumnHeader, DataTableDropDown } from '@/components/ui/datatable'

export const columns: Array<ColumnDef<IGetRoadMap>> = [
	{
		id: 'Nom',
		accessorKey: 'name',
		header: ({ column }) => h(DataTableColumnHeader<IGetRoadMap>, { column, title: 'Nom' }),
		cell: ({ row }) => h('div', row.getValue('Nom'))
	},
	{
		id: 'Date de création',
		accessorKey: 'createdAt',
		header: ({ column }) =>
			h(DataTableColumnHeader<IGetRoadMap>, { column, title: 'Date de création' }),
		cell: ({ row }) => h('div', new Date(row.getValue('Date de création')).toLocaleDateString())
	},
	{
		id: 'Actions',
		cell: ({ row }) =>
			h(
				'div',
				h(DataTableDropDown, { name: 'RoadMapsEdit', id: row.original.id, email:""})
			),
		enableHiding: false
	}
]
