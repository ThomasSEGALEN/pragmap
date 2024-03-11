<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-vue-next'

defineProps<{
	name: string
	id: string
	deleteEntity: (id: string) => void
}>()
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button
				class="h-8 w-8 relative p-0 focus-visible:bg-background"
				variant="ghost"
			>
				<MoreHorizontal class="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup class="space-y-1">
				<DropdownMenuItem as-child>
					<RouterLink :to="{ name: name, params: { id: id } }">Modifier</RouterLink>
				</DropdownMenuItem>
				<DropdownMenuItem @click="deleteEntity(id)"> Supprimer </DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
