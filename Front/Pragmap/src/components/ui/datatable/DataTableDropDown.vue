<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

defineProps<{
	email: string
	name: string
	id: string
}>()

const copy = (email: string) => {
	navigator.clipboard.writeText(email)
}
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button
				variant="ghost"
				class="w-8 h-8 relative p-0"
			>
				<span class="sr-only">Open menu</span>
				<MoreHorizontal class="w-4 h-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuItem @click="copy(email)">Copier l'adresse e-mail</DropdownMenuItem>
			<DropdownMenuSeparator />
			<RouterLink :to="{ name: name, params: { id: id } }">
				<DropdownMenuItem>Modifier</DropdownMenuItem>
			</RouterLink>
			<DropdownMenuItem>Supprimer</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
