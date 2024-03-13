<script setup lang="ts" generic="TData">
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'
import type { Table } from '@tanstack/vue-table'
import { Button } from '@/components/ui//button'
import { ChevronDown } from 'lucide-vue-next'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

defineProps<{
	table: Table<TData>
}>()

const searchInput = ref<HTMLInputElement | null>(null)
useFocus(searchInput, { initialValue: true })
</script>

<template>
	<div class="flex flex-col justify-between space-y-2 md:flex-row md:space-y-0">
		<Input
			class="md:w-56"
			ref="searchInput"
			name="search"
			:placeholder="`Recherchez par ${table.getAllColumns()[0].id.toLowerCase()}`"
			:model-value="table.getColumn(table.getAllColumns()[0].id)?.getFilterValue() as string"
			@update:model-value="table.getColumn(table.getAllColumns()[0].id)?.setFilterValue($event)"
		/>
		<DropdownMenu>
			<DropdownMenuTrigger as-child>
				<Button variant="outline">
					Colonnes
					<ChevronDown class="h-4 w-4 ml-2" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuCheckboxItem
					v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
					:key="column.id"
					:checked="column.getIsVisible()"
					@update:checked="
						(value) => {
							column.toggleVisibility(!!value)
						}
					"
				>
					{{ column.id }}
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</template>
