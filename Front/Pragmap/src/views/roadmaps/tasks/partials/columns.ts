import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useTableStore } from '@/stores'
import { DataTableColumnHeader } from '@/components/ui/datatable'
import { Progress } from '@/components/ui/progress'
import UpdateDialog from '../../partials/UpdateDialog.vue'

const { getTasksData } = useTableStore()

// TODO: Régler le problème de chargement du composant UpdateDialog

export const columns: Array<ColumnDef<any>> = [
	{
		id: 'Label',
		accessorKey: 'label',
		header: ({ column }) =>
			h(
				DataTableColumnHeader<
					Array<{
						id: string
						type: string
						label: string
						description: string
						duration: number
						progress: number
					}>
				>,
				{ column, title: 'Label' }
			),
		cell: ({ row }) =>
			h(
				UpdateDialog,
				{ entities: getTasksData(), entityId: row.original.id, entityData: 'label' },
				() => h('div', row.getValue('Label'))
			)
	},
	{
		id: 'Description',
		accessorKey: 'description',
		header: ({ column }) =>
			h(
				DataTableColumnHeader<
					Array<{
						id: string
						type: string
						label: string
						description: string
						duration: number
						progress: number
					}>
				>,
				{ column, title: 'Description' }
			),
		cell: ({ row }) =>
			h(
				UpdateDialog,
				{ entities: getTasksData(), entityId: row.original.id, entityData: 'description' },
				() => h('div', row.getValue('Description'))
			)
	},
	{
		id: 'Durée',
		accessorKey: 'duration',
		header: ({ column }) =>
			h(
				DataTableColumnHeader<
					Array<{
						id: string
						type: string
						label: string
						description: string
						duration: number
						progress: number
					}>
				>,
				{ column, title: 'Durée' }
			),
		cell: ({ row }) =>
			h(
				UpdateDialog,
				{
					entities: getTasksData(),
					entityId: row.original.id,
					entityData: 'duration',
					entityType: 'number'
				},
				() => h('div', row.getValue('Durée'))
			)
	},
	{
		id: 'Progression',
		accessorKey: 'progress',
		header: ({ column }) =>
			h(
				DataTableColumnHeader<
					Array<{
						id: string
						type: string
						label: string
						description: string
						duration: number
						progress: number
					}>
				>,
				{ column, title: 'Progression' }
			),
		cell: ({ row }) =>
			h(
				UpdateDialog,
				{
					entities: getTasksData(),
					entityId: row.original.id,
					entityData: 'progress',
					entityType: 'number'
				},
				() => h(Progress, { class: 'w-40', modelValue: parseInt(row.getValue('Progression')) })
			)
	}
]
