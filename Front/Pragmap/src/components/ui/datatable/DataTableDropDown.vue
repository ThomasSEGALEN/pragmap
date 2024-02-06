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
import { userService } from '@/services'

defineProps<{
	name: string
	id: string
	email: string
}>()

const copyEmail = (email: string) => navigator.clipboard.writeText(email)
const deleteUser = async (id: string) => await userService.delete(id)
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button
				variant="ghost"
				class="h-8 w-8 relative p-0"
			>
				<span class="sr-only">Ouvrir le menu</span>
				<MoreHorizontal class="h-4 w-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuItem @click="copyEmail(email)">Copier l'adresse e-mail</DropdownMenuItem>
			<DropdownMenuSeparator />
			<RouterLink :to="{ name: name, params: { id: id } }">
				<DropdownMenuItem>Modifier</DropdownMenuItem>
			</RouterLink>
			<DropdownMenuItem @click="deleteUser(id)">Supprimer</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
