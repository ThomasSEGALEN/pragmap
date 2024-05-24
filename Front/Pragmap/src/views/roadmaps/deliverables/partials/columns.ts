import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useTableStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/ui/datatable'
import { Download } from 'lucide-vue-next'
import { Progress } from '@/components/ui/progress'
import UpdateDialog from '../../partials/UpdateDialog.vue'

const { getDeliverablesData } = useTableStore()

export const columns: Array<ColumnDef<any>> = [
	{
		id: 'Nom',
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
				{ column, title: 'Nom' }
			),
		cell: ({ row }) =>
			h(
				UpdateDialog,
				{ entities: getDeliverablesData(), entityId: row.original.id, entityData: 'label' },
				() => h('div', row.getValue('Nom'))
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
				{ entities: getDeliverablesData(), entityId: row.original.id, entityData: 'description' },
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
					entities: getDeliverablesData(),
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
					entities: getDeliverablesData(),
					entityId: row.original.id,
					entityData: 'progress',
					entityType: 'number'
				},
				() => h(Progress, { class: 'w-40', modelValue: parseInt(row.getValue('Progression')) })
			)
	},
	{
		id: 'Fichier',
		accessorKey: 'file',
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
						file: string
					}>
				>,
				{ column, title: 'Fichier' }
			),
		cell: ({ row }) =>
			row.getValue('Fichier')
				? h(
						Button,
						{
							class: 'w-auto px-2 focus-visible:ring-offset-0',
							variant: 'outline',
							asChild: true
						},
						() =>
							h(
								'a',
								{
									href: row.getValue('Fichier'),
									download: row.getValue('Nom')
								},
								[h(Download, { class: 'pr-2' }), 'Télécharger']
							)
					)
				: h(
						Button,
						{
							class: 'w-auto px-2 focus-visible:ring-offset-0',
							variant: 'outline',
							disabled: true
						},
						() => [h(Download, { class: 'pr-2' }), 'Télécharger']
					)
	}
]
