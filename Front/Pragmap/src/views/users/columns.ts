import { h } from 'vue'
import type { ColumnDef, Row } from '@tanstack/vue-table'
import router from '@/router'
import { userService } from '@/services'
import { useAuthStore } from '@/stores'
import type { IGetUser } from '@/types'
import { DataTableColumnHeader, DataTableDropDown } from '@/components/ui/datatable'
import { toast } from '@/components/ui/toast'

const { roles } = useAuthStore()
const getRole = (row: Row<IGetUser>) => roles.find((role) => role.id === row.getValue('Rôle'))!.name

export const columns: Array<ColumnDef<IGetUser>> = [
	{
		id: 'Adresse e-mail',
		accessorKey: 'email',
		header: ({ column }) => h(DataTableColumnHeader<IGetUser>, { column, title: 'Adresse e-mail' }),
		cell: ({ row }) => h('div', row.getValue('Adresse e-mail'))
	},
	{
		id: 'Nom',
		accessorKey: 'lastName',
		header: ({ column }) => h(DataTableColumnHeader<IGetUser>, { column, title: 'Nom' }),
		cell: ({ row }) => h('div', row.getValue('Nom'))
	},
	{
		id: 'Prénom',
		accessorKey: 'firstName',
		header: ({ column }) => h(DataTableColumnHeader<IGetUser>, { column, title: 'Prénom' }),
		cell: ({ row }) => h('div', row.getValue('Prénom'))
	},
	{
		id: 'Rôle',
		accessorKey: 'roleId',
		header: ({ column }) => h(DataTableColumnHeader<IGetUser>, { column, title: 'Rôle' }),
		cell: ({ row }) => h('div', getRole(row)),
		sortingFn: (rowA, rowB) => getRole(rowA).localeCompare(getRole(rowB))
	},
	{
		id: 'Date de création',
		accessorKey: 'createdAt',
		header: ({ column }) =>
			h(DataTableColumnHeader<IGetUser>, { column, title: 'Date de création' }),
		cell: ({ row }) => h('div', new Date(row.getValue('Date de création')).toLocaleDateString())
	},
	{
		id: 'Actions',
		cell: ({ row }) =>
			h(
				'div',
				h(DataTableDropDown, {
					name: 'UsersEdit', id: row.original.id, deleteEntity: async (id: string) => {
						try {
							await userService.delete(id)

							router.go(0)
						} catch (error) {
							toast({
								title: 'Erreur',
								description: `Nous ne sommes pas parvenus à supprimer cet utilisateur.`,
								duration: 5000
							})
						}
					}
				})
			),
		enableHiding: false
	}
]
