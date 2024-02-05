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
		class="flex flex-col space-y-2 sm:flex-row-reverse sm:space-y-0 justify-between items-center"
	>
		<div class="flex items-center space-x-2">
			<div class="flex items-center justify-center text-sm font-medium">
				Page {{ getPageIndex() + 1 }} sur {{ getPageCount() }}
			</div>
			<Button
				variant="outline"
				class="w-8 h-8 p-0"
				:disabled="!getCanPreviousPage()"
				@click="setPageIndex(0)"
			>
				<span class="sr-only">Aller à la première page</span>
				<ChevronsLeft class="w-4 h-4" />
			</Button>
			<Button
				variant="outline"
				class="w-8 h-8 p-0"
				:disabled="!getCanPreviousPage()"
				@click="previousPage()"
			>
				<span class="sr-only">Aller à la page précédente</span>
				<ChevronLeft class="w-4 h-4" />
			</Button>
			<Button
				variant="outline"
				class="w-8 h-8 p-0"
				:disabled="!getCanNextPage()"
				@click="nextPage()"
			>
				<span class="sr-only">Aller à la page suivante</span>
				<ChevronRight class="w-4 h-4" />
			</Button>
			<Button
				variant="outline"
				class="w-8 h-8 p-0"
				:disabled="!getCanNextPage()"
				@click="setPageIndex(getPageCount() - 1)"
			>
				<span class="sr-only">Aller à la dernière page</span>
				<ChevronsRight class="w-4 h-4" />
			</Button>
		</div>
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium">Lignes par page</p>
			<Select
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
