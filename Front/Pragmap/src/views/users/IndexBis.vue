<script setup lang="ts">
import { Layout } from '@/components/layouts'

import type {
  ColumnDef
} from '@tanstack/vue-table'

import { ArrowUpDown } from 'lucide-vue-next'

import { h } from 'vue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import DataTable from '@/components/DataTable.vue'
import { toast } from '@/components/ui/toast'
import type { IUser } from '@/types'
import DropdownAction from '@/components/DropdownAction.vue'
import { userService } from '@/services'
import { useQuery } from '@tanstack/vue-query'
import router from '@/router'

const columns: Array<ColumnDef<IUser>> = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked: table.getIsAllPageRowsSelected(),
        'onUpdate:checked': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all'
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row'
      }),
    enableSorting: false,
    enableHiding: false
  },
	// {
  //   accessorKey: 'id',
  //   header: ({ column }) => {
  //     return h(
  //       Button,
  //       {
  //         class: 'p-0',
  //         variant: 'ghost',
  //         onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
  //       },
  //       () => ['ID', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
  //     )
  //   },
  //   cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('id'))
  // },
	{
    accessorKey: 'LastName',
    header: ({ column }) => {
      return h(
        Button,
        {
          class: 'p-0',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['Nom', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('LastName'))
	},
  {
    accessorKey: 'FirstName',
    header: ({ column }) => {
      return h(
        Button,
        {
          class: 'p-0',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['Prénom', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('FirstName'))
  },
  {
    accessorKey: 'Email',
    header: ({ column }) => {
      return h(
        Button,
        {
          class: 'p-0',
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
        },
        () => ['Adresse e-mail', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      )
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('Email'))
  },
  // {
  //   accessorKey: 'role',
  //   header: ({ column }) => {
  //     return h(
  //       Button,
  //       {
  //         class: 'p-0',
  //         variant: 'ghost',
  //         onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
  //       },
  //       () => ['Rôle', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
  //     )
  //   },
  //   cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('role'))
  // },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
					id: user['Id'],
					name: 'UsersEdit',
					notify: notify,
					deleteEntity: deleteUser
        })
      )
    }
  }
]
const notify = (status: string, message: string): void => {
	toast({
		title: status,
		description: message,
		duration: 5000
	})
}
const deleteUser = async (id: string) => {
	try {
		await userService.delete(id)

		notify('Succès', 'Utilisateur supprimé')
	} catch (error) {
		notify('Erreur', "Nous ne sommes pas parvenus à supprimer l'utilisateur")
	}
}

const { isLoading, isError, error, data } = useQuery({
  queryKey: ['data'],
  queryFn: async () => await userService.getAll({ select: ['id', 'lastName', 'firstName', 'email'], expand: ['Role'] })
})
</script>

<template>
  <Layout>
		<div class="w-full">
			<template v-if="isLoading">
				<span>Loading...</span>
			</template>
			<template v-else-if="isError">
				<span>Error : {{ error }}</span>
			</template>
			<template v-if="data">
				<DataTable :columns="columns" :data="data" />
			</template>
		</div>
  </Layout>
</template>
