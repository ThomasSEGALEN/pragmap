<script setup lang="ts">
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
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
				<AlertDialog>
					<DropdownMenuItem
						@select="(e) => e.preventDefault()"
						as-child
					>
						<AlertDialogTrigger as-child>
							<Button
								class="h-8 w-full justify-start font-normal hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-accent"
								variant="ghost"
							>
								Supprimer
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
								<AlertDialogDescription>
									Cette action ne peut être annulée, elle supprimera définitivement les données
									concernées.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								<AlertDialogAction @click="deleteEntity(id)">Continuer</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</DropdownMenuItem>
				</AlertDialog>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
