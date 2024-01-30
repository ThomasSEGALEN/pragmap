import { h } from 'vue'
import type { ColumnDef, Row } from '@tanstack/vue-table'
import { useAuthStore } from '@/stores'
import type { IGetUser } from '@/types'
import { DataTableColumnHeader, DataTableDropDown } from '@/components/ui/datatable'

const { roles } = useAuthStore()
const getRole = (row: Row<IGetUser>) => roles.find((role) => role.id === row.getValue('Rôle'))!.name
export const columns: Array<ColumnDef<IGetUser>> = [
  {
    id: 'Adresse e-mail',
    accessorKey: 'email',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Adresse e-mail' }),
    cell: ({ row }) => h('div', row.getValue('Adresse e-mail'))
  },
  {
    id: 'Nom',
    accessorKey: 'lastName',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Nom' }),
    cell: ({ row }) => h('div', row.getValue('Nom'))
  },
  {
    id: 'Prénom',
    accessorKey: 'firstName',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Prénom' }),
    cell: ({ row }) => h('div', row.getValue('Prénom'))
  },
  {
    id: 'Rôle',
    accessorKey: 'roleId',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Rôle' }),
    cell: ({ row }) => h('div', getRole(row)),
    sortingFn: (rowA, rowB) => getRole(rowA).localeCompare(getRole(rowB))
  },
  {
    id: 'Date de création',
    accessorKey: 'createdAt',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Date de création' }),
    cell: ({ row }) => h('div', new Date(row.getValue('Date de création')).toLocaleDateString())
  },
  {
    id: 'Actions',
    cell: ({ row }) =>
      h(
        'div',
        h(DataTableDropDown, { name: 'UsersEdit', id: row.original.id, email: row.original.email })
      ),
    enableHiding: false
  }
]
