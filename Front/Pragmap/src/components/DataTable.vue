<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import {
    FlexRender,
    getCoreRowModel,
    useVueTable,
} from "@tanstack/vue-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from '@tanstack/vue-table'
import {
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/vue-table'
import { valueUpdater } from '@/lib/utils'
import { ref } from 'vue'
import Pagination from '@/components/Pagination.vue'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'



const { columns, data } = defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}>()

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const table = useVueTable({
	data,
	columns,
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
	onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
	onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
	onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
	state: {
		get sorting() {
			return sorting.value
		},
		get columnFilters() {
			return columnFilters.value
		},
		get columnVisibility() {
			return columnVisibility.value
		},
		get rowSelection() {
			return rowSelection.value
		}
	}
})
</script>

<template>
	<div class="flex gap-2 items-center py-4">
		<Input
			class="max-w-sm"
			placeholder="Filter emails..."
			:model-value="table.getColumn('Email')?.getFilterValue() as string"
			@update:model-value="table.getColumn('Email')?.setFilterValue($event)"
		/>
		<DropdownMenu>
			<DropdownMenuTrigger as-child>
				<Button variant="outline" class="ml-auto">
					Columns <ChevronDown class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuCheckboxItem
					v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
					:key="column.id"
					class="capitalize"
					:checked="column.getIsVisible()"
					@update:checked="
						(value: boolean) => {
							column.toggleVisibility(!!value)
						}
					"
				>
					{{ column.id }}
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>

	<div class="rounded-md border">
		<Table>
			<TableHeader>
				<TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
					<TableHead v-for="header in headerGroup.headers" :key="header.id">
						<FlexRender
							v-if="!header.isPlaceholder"
							:render="header.column.columnDef.header"
							:props="header.getContext()"
						/>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows?.length">
					<TableRow
						v-for="row in table.getRowModel().rows"
						:key="row.id"
						:data-state="row.getIsSelected() && 'selected'"
					>
						<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
							<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
						</TableCell>
					</TableRow>
				</template>

				<TableRow v-else>
					<TableCell col-span="{columns.length}" class="h-24 text-center">
						No results.
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>

	<Pagination :table="table" />
</template>