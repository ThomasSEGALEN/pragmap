<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
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
				class="h-8 w-8 relative p-0"
				variant="ghost"
			>
				<span class="sr-only">Ouvrir le menu</span>
				<MoreHorizontal class="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<RouterLink :to="{ name: name, params: { id: id } }">
				<DropdownMenuItem>Modifier</DropdownMenuItem>
			</RouterLink>
			<DropdownMenuItem @click="deleteEntity(id)">Supprimer</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
