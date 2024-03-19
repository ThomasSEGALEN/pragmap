import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import router from '@/router'
import { roadmapService } from '@/services'
import type { RoadmapsData } from '@/stores'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader, DataTableDropDown } from '@/components/ui/datatable'
import { toast } from '@/components/ui/toast'

export const columns: Array<ColumnDef<RoadmapsData>> = [
	{
		id: 'Nom',
		accessorKey: 'name',
		header: ({ column }) => h(DataTableColumnHeader<RoadmapsData>, { column, title: 'Nom' }),
		cell: ({ row }) =>
			h(
				Button,
				{
					class: 'px-0 focus-visible:bg-background',
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
		id: 'Actions',
		cell: ({ row }) =>
			h(DataTableDropDown, {
				name: 'RoadmapsEdit',
				id: row.original.id,
				deleteEntity: async (id: string) => {
					try {
						await roadmapService.delete(id)

						router.go(0)
					} catch (error) {
						toast({
							title: 'Erreur',
							description: 'Nous ne sommes pas parvenus à supprimer cette roadmap.',
							duration: 5000
						})
					}
				}
			}),
		enableHiding: false
	}
]
