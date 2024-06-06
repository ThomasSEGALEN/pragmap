import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { roadmapService } from '@/services'
import type { RoadmapsData } from '@/stores'
import { Button } from '@/components/ui/button'
import { DataTableAction, DataTableColumnHeader } from '@/components/ui/datatable'
import { toast } from '@/components/ui/toast'
import RoadmapActions from './RoadmapActions.vue'

export const columns: Array<ColumnDef<RoadmapsData>> = [
	{
		id: 'Nom',
		accessorKey: 'name',
		header: ({ column }) => h(DataTableColumnHeader<RoadmapsData>, { column, title: 'Nom' }),
		cell: ({ row }) =>
			h(
				Button,
				{
					class: 'px-2 focus-visible:ring-offset-0',
					variant: 'link',
					as: 'a',
					href: `/roadmaps/${row.original.id}/designer`
				},
				() => row.getValue('Nom')
			)
	},
	{
		id: 'Client',
		accessorKey: 'customerName',
		header: ({ column }) => h(DataTableColumnHeader<RoadmapsData>, { column, title: 'Client' }),
		cell: ({ row }) => h('div', row.getValue('Client'))
	},
	{
		id: 'Date de création',
		accessorKey: 'createdAt',
		header: ({ column }) =>
			h(DataTableColumnHeader<RoadmapsData>, { column, title: 'Date de création' }),
		cell: ({ row }) => h('div', new Date(row.getValue('Date de création')).toLocaleDateString())
	},
	{
		id: 'Gestion',
		accessorKey: 'management',
		header: ({ column }) => h(DataTableColumnHeader<RoadmapsData>, { column, title: 'Gestion' }),
		cell: ({ row }) => h(RoadmapActions, { id: row.original.id }),
		enableSorting: false,
		enableHiding: false
	},
	{
		id: 'Actions',
		accessorKey: 'actions',
		header: ({ column }) => h(DataTableColumnHeader<RoadmapsData>, { column, title: 'Actions' }),
		cell: ({ row }) =>
			h(DataTableAction, {
				name: 'RoadmapsEdit',
				id: row.original.id,
				customerId: row.original.customerId as string,
				deleteEntity: async (id: string) => {
					try {
						await roadmapService.delete(id)
					} catch (error) {
						toast({
							title: 'Erreur',
							description: 'Nous ne sommes pas parvenus à supprimer cette roadmap.',
							duration: 5000
						})
					}
				}
			}),
		enableSorting: false,
		enableHiding: false
	}
]
