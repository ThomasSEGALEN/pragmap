import { h } from 'vue'
import { RouterLink } from 'vue-router'
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
		cell: ({ row }) =>
			h('div', { class: 'flex flex-col place-items-start' }, [
				h(
					Button,
					{
						class: 'px-2 focus-visible:ring-offset-0',
						variant: 'link',
						asChild: true
					},
					() =>
						h(
							RouterLink,
							{
								to: `/roadmaps/${row.original.id}/schedule`
							},
							() => 'Planning'
						)
				),
				h(
					Button,
					{
						class: 'px-2 focus-visible:ring-offset-0',
						variant: 'link',
						asChild: true
					},
					() =>
						h(
							RouterLink,
							{
								to: `/roadmaps/${row.original.id}/tasks`
							},
							() => 'Tâches'
						)
				),
				h(
					Button,
					{
						class: 'px-2 focus-visible:ring-offset-0',
						variant: 'link',
						asChild: true
					},
					() =>
						h(
							RouterLink,
							{
								to: `/roadmaps/${row.original.id}/deliverables`
							},
							() => 'Livrables'
						)
				)
			]),
		enableSorting: false,
		enableHiding: false
	},
	{
		id: 'Actions',
		cell: ({ row }) =>
			h(DataTableDropDown, {
				name: 'RoadmapsEdit',
				id: row.original.id,
				deleteEntity: (id: string) => {
					try {
						roadmapService.delete(id).then(() => router.go(0))
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
