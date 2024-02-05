<script setup lang="ts" generic="TData">
import type { Column } from '@tanstack/vue-table'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps {
	column: Column<TData, any>
	title: string
}

defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>

<template>
	<div
		v-if="column.getCanSort()"
		:class="cn('flex items-center space-x-2', $attrs.class ?? '')"
	>
		<DropdownMenu>
			<DropdownMenuTrigger as-child>
				<Button
					variant="ghost"
					size="sm"
					class="-ml-3 h-8 data-[state=open]:bg-accent"
				>
					<span class="whitespace-nowrap">{{ title }}</span>
					<ArrowDown
						v-if="column.getIsSorted() === 'desc'"
						class="w-4 h-4 ml-2"
					/>
					<ArrowUp
						v-else-if="column.getIsSorted() === 'asc'"
						class="w-4 h-4 ml-2"
					/>
					<ArrowUpDown
						v-else
						class="w-4 h-4 ml-2"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuItem @click="column.toggleSorting(false)">
					<ArrowUp class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Ascendant
				</DropdownMenuItem>
				<DropdownMenuItem @click="column.toggleSorting(true)">
					<ArrowDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Descendant
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem @click="column.toggleVisibility(false)">
					<EyeOff class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
					Cacher
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
	<div
		v-else
		:class="$attrs.class"
	>
		{{ title }}
	</div>
</template>
