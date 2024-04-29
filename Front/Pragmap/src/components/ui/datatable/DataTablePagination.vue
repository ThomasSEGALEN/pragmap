<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

const { table } = defineProps<{
	table: Table<TData>
}>()
</script>

<template>
	<div
		class="flex flex-col space-y-2 md:flex-row-reverse md:space-y-0 justify-between items-center"
	>
		<div class="flex items-center space-x-2">
			<div class="flex items-center justify-center text-sm font-medium">
				Page {{ table.getState().pagination.pageIndex + 1 }} sur {{ table.getPageCount() }}
			</div>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!table.getCanPreviousPage()"
				@click="table.previousPage()"
			>
				<ChevronsLeft class="h-4 w-4" />
			</Button>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!table.getCanPreviousPage()"
				@click="table.previousPage()"
			>
				<ChevronLeft class="h-4 w-4" />
			</Button>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!table.getCanNextPage()"
				@click="table.nextPage()"
			>
				<ChevronRight class="h-4 w-4" />
			</Button>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!table.getCanNextPage()"
				@click="table.nextPage()"
			>
				<ChevronsRight class="h-4 w-4" />
			</Button>
		</div>
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium">Lignes par page</p>
			<Select
				name="pageSize"
				:model-value="`${table.getState().pagination.pageSize}`"
				@update:model-value="table.setPageSize"
			>
				<SelectTrigger class="h-8 w-[70px]">
					<SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
				</SelectTrigger>
				<SelectContent side="top">
					<SelectItem
						v-for="pageSize in [10, 20, 30, 40, 50]"
						:key="pageSize"
						:value="`${pageSize}`"
					>
						{{ pageSize }}
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</div>
</template>
