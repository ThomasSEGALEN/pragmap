<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types/role'
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
import { Pencil, Trash2 } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

defineProps<{
	name: string
	id: string
	customerId?: string
	deleteEntity: (id: string) => void
}>()

const { getRole } = useAuthStore()
const roleName = (await getRole()).name
</script>

<template>
	<div class="flex space-x-2">
		<TooltipProvider v-if="roleName === Role.Administrator || roleName === Role.Manager">
			<Tooltip>
				<TooltipTrigger as-child>
					<Button
						variant="outline"
						size="icon"
						as-child
					>
						<RouterLink :to="{ name: name, params: { id: id } }">
							<Pencil class="h-4 w-4" />
						</RouterLink>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Modifier</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
		<TooltipProvider v-if="roleName === Role.Administrator">
			<Tooltip>
				<AlertDialog>
					<TooltipTrigger as-child>
						<AlertDialogTrigger as-child>
							<Button
								variant="outline"
								size="icon"
							>
								<Trash2 class="h-4 w-4" />
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
					</TooltipTrigger>
				</AlertDialog>
				<TooltipContent>
					<p>Supprimer</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
</template>
