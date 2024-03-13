<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { FolderKanban, GanttChart, Handshake, UserRound } from 'lucide-vue-next'

defineProps<{
	isToggled: boolean
}>()
defineEmits(['toggleSidebar'])

const route = useRoute()
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
			<Button
				class="h-8 w-full justify-start sm:justify-center focus-visible:bg-background"
				:class="{ 'bg-accent text-accent-foreground': route.path === '/' }"
				variant="ghost"
				as-child
				@click="$emit('toggleSidebar')"
			>
				<RouterLink to="/">Accueil</RouterLink>
			</Button>
		</div>
		<div class="w-full flex flex-col md:hidden">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-muted-foreground text-sm ml-2 sm:ml-0 mb-2"
			>
				<UserRound class="h-4 w-4 mr-2" />
				Utilisateurs
			</div>
			<Button
				class="h-8 w-full justify-start sm:justify-center focus-visible:bg-background"
				:class="{ 'bg-accent text-accent-foreground': route.path === '/users' }"
				variant="ghost"
				as-child
				@click="$emit('toggleSidebar')"
			>
				<RouterLink to="/users">Lister</RouterLink>
			</Button>
			<Button
				class="h-8 w-full justify-start sm:justify-center focus-visible:bg-background"
				:class="{ 'bg-accent text-accent-foreground': route.path === '/users/create' }"
				variant="ghost"
				as-child
				@click="$emit('toggleSidebar')"
			>
				<RouterLink to="/users/create">Créer</RouterLink>
			</Button>
		</div>
		<div class="w-full flex flex-col">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm text-muted-foreground ml-2 sm:ml-0 mb-2"
			>
				<Handshake class="h-4 w-4 mr-2" />
				Clients
			</div>
			<Button
				class="h-8 w-full justify-start sm:justify-center focus-visible:bg-background"
				:class="{ 'bg-accent text-accent-foreground': route.path === '/customers' }"
				variant="ghost"
				as-child
				@click="$emit('toggleSidebar')"
			>
				<RouterLink to="/customers">Lister</RouterLink>
			</Button>
			<Button
				class="h-8 w-full justify-start sm:justify-center focus-visible:bg-background"
				:class="{ 'bg-accent text-accent-foreground': route.path === '/customers/create' }"
				variant="ghost"
				as-child
				@click="$emit('toggleSidebar')"
			>
				<RouterLink to="/customers/create">Créer</RouterLink>
			</Button>
		</div>
		<div class="w-full flex flex-col">
			<div
				class="flex justify-start sm:justify-center items-center font-semibold text-sm text-muted-foreground ml-2 sm:ml-0 mb-2"
			>
				<FolderKanban class="h-4 w-4 mr-2" />
				Roadmaps
			</div>
			<Button
				class="h-8 w-full justify-start sm:justify-center focus-visible:bg-background"
				:class="{ 'bg-accent text-accent-foreground': route.path === '/roadmaps' }"
				variant="ghost"
				as-child
				@click="$emit('toggleSidebar')"
			>
				<RouterLink to="/roadmaps">Lister</RouterLink>
			</Button>
			<Button
				class="h-8 w-full justify-start sm:justify-center focus-visible:bg-background"
				:class="{ 'bg-accent text-accent-foreground': route.path === '/roadmaps/create' }"
				variant="ghost"
				as-child
				@click="$emit('toggleSidebar')"
			>
				<RouterLink to="/roadmaps/create">Créer</RouterLink>
			</Button>
		</div>
	</div>
</template>
