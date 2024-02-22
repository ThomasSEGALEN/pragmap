<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { FolderKanban, GanttChart, Handshake, UserRound } from 'lucide-vue-next'

defineProps({
	isToggled: Boolean
})
</script>

<template>
	<div
		class="h-fit w-full space-y-2 border-y p-2 bg-background md:hidden"
		:class="isToggled ? 'absolute top-16 sm:flex sm:flex-col sm:items-center' : 'hidden'"
	>
		<div class="w-full flex flex-col md:hidden">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm text-muted-foreground ml-2 sm:ml-0 mb-2"
			>
				<GanttChart class="h-4 w-4 mr-2" />
				Pragmap
			</div>
			<RouterLink to="/users/create">
				<Button
					class="h-8 w-full justify-start sm:justify-center"
					variant="ghost"
					tabindex="-1"
				>
					Accueil
				</Button>
			</RouterLink>
		</div>
		<div class="w-full flex flex-col md:hidden">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-muted-foreground text-sm ml-2 sm:ml-0 mb-2"
			>
				<UserRound class="h-4 w-4 mr-2" />
				Utilisateurs
			</div>
			<RouterLink to="/users">
				<Button
					class="h-8 w-full justify-start sm:justify-center"
					variant="ghost"
					tabindex="-1"
				>
					Lister
				</Button>
			</RouterLink>
			<RouterLink to="/users/create">
				<Button
					class="h-8 w-full justify-start sm:justify-center"
					variant="ghost"
					tabindex="-1"
				>
					Créer
				</Button>
			</RouterLink>
		</div>
		<div class="w-full flex flex-col">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm text-muted-foreground ml-2 sm:ml-0 mb-2"
			>
				<Handshake class="h-4 w-4 mr-2" />
				Clients
			</div>
			<RouterLink to="/customers">
				<Button
					class="h-8 w-full justify-start sm:justify-center"
					variant="ghost"
					tabindex="-1"
				>
					Lister
				</Button>
			</RouterLink>
			<RouterLink to="/customers/create">
				<Button
					class="h-8 w-full justify-start sm:justify-center"
					variant="ghost"
					tabindex="-1"
				>
					Créer
				</Button>
			</RouterLink>
		</div>
		<div class="w-full flex flex-col">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm text-muted-foreground ml-2 sm:ml-0 mb-2"
			>
				<FolderKanban class="h-4 w-4 mr-2" />
				Roadmaps
			</div>
			<RouterLink to="/roadmaps">
				<Button
					class="h-8 w-full justify-start sm:justify-center"
					variant="ghost"
					tabindex="-1"
				>
					Lister
				</Button>
			</RouterLink>
			<RouterLink to="/roadmaps/create">
				<Button
					class="h-8 w-full justify-start sm:justify-center"
					variant="ghost"
					tabindex="-1"
				>
					Créer
				</Button>
			</RouterLink>
		</div>
	</div>
</template>
