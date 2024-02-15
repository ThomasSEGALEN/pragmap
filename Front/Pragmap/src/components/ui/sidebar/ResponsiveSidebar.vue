<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { GanttChart, Handshake, UserRound } from 'lucide-vue-next'

defineProps({
	isToggled: Boolean
})
</script>

<template>
	<div
		class="h-fit w-full space-y-2 border-y p-2 mt-16 bg-background md:hidden"
		:class="isToggled ? 'fixed sm:flex sm:flex-col sm:items-center' : 'hidden'"
	>
		<div class="w-full flex flex-col md:hidden">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm ml-2 sm:ml-0 mb-2 text-muted-foreground"
			>
				<GanttChart class="h-4 w-4 mr-2" />
				Pragmap
			</div>
			<RouterLink to="/users/create">
				<Button
					variant="ghost"
					class="h-8 w-full justify-start sm:justify-center"
				>
					Accueil
				</Button>
			</RouterLink>
		</div>
		<div class="w-full flex flex-col md:hidden">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm ml-2 sm:ml-0 mb-2 text-muted-foreground"
			>
				<UserRound class="h-4 w-4 mr-2" />
				Utilisateurs
			</div>
			<RouterLink to="/users">
				<Button
					variant="ghost"
					class="h-8 w-full justify-start sm:justify-center"
				>
					Lister
				</Button>
			</RouterLink>
			<RouterLink to="/users/create">
				<Button
					variant="ghost"
					class="h-8 w-full justify-start sm:justify-center"
				>
					Créer
				</Button>
			</RouterLink>
		</div>
		<div class="w-full flex flex-col">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm ml-2 sm:ml-0 mb-2 text-muted-foreground"
			>
				<Handshake class="h-4 w-4 mr-2" />
				Clients
			</div>
			<RouterLink to="/customers">
				<Button
					variant="ghost"
					class="h-8 w-full justify-start sm:justify-center"
				>
					Lister
				</Button>
			</RouterLink>
			<RouterLink to="/customers/create">
				<Button
					variant="ghost"
					class="h-8 w-full justify-start sm:justify-center"
				>
					Créer
				</Button>
			</RouterLink>
		</div>
	</div>
</template>
