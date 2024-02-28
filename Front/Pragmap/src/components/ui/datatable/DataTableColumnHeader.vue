<script setup lang="ts" generic="TData">
import type { Column } from '@tanstack/vue-table'
import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
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
					class="-ml-3 h-8 data-[state=open]:bg-accent focus-visible:bg-background"
					variant="ghost"
					size="sm"
				>
					<span class="whitespace-nowrap">{{ title }}</span>
					<ArrowDown
						v-if="column.getIsSorted() === 'desc'"
						class="h-4 w-4 ml-2"
					/>
					<ArrowUp
						v-else-if="column.getIsSorted() === 'asc'"
						class="h-4 w-4 ml-2"
					/>
					<ArrowUpDown
						v-else
						class="h-4 w-4 ml-2"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuGroup class="space-y-1">
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
				</DropdownMenuGroup>
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
