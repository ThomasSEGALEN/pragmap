<script setup lang="ts" generic="TData">
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { usePaginationStore } from '@/stores/pagination'

const {
	getPageCount,
	getPageIndex,
	getPageSize,
	setPageIndex,
	setPageSize,
	nextPage,
	previousPage,
	getCanNextPage,
	getCanPreviousPage
} = usePaginationStore()
</script>

<template>
	<div
		class="flex flex-col space-y-2 md:flex-row-reverse md:space-y-0 justify-between items-center"
	>
		<div class="flex items-center space-x-2">
			<div class="flex items-center justify-center text-sm font-medium">
				Page {{ getPageIndex() + 1 }} sur {{ getPageCount() === 0 ? 1 : getPageCount() }}
			</div>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!getCanPreviousPage()"
				@click="setPageIndex(0)"
			>
				<ChevronsLeft class="h-4 w-4" />
			</Button>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!getCanPreviousPage()"
				@click="previousPage()"
			>
				<ChevronLeft class="h-4 w-4" />
			</Button>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!getCanNextPage()"
				@click="nextPage()"
			>
				<ChevronRight class="h-4 w-4" />
			</Button>
			<Button
				class="h-8 w-8 p-0"
				variant="outline"
				:disabled="!getCanNextPage()"
				@click="setPageIndex(getPageCount() - 1)"
			>
				<ChevronsRight class="h-4 w-4" />
			</Button>
		</div>
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium">Lignes par page</p>
			<Select
				name="pageSize"
				:model-value="`${getPageSize()}`"
				@update:model-value="setPageSize(parseInt($event))"
			>
				<SelectTrigger class="h-8 w-[70px]">
					<SelectValue :placeholder="`${getPageSize()}`" />
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
