<script setup lang="ts">
import { useRoute } from 'vue-router'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { FolderKanban, Handshake, LogOut, UserRound, UserRoundCog } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const { user } = useAuthStore()
</script>

<template>
	<div :class="cn('pb-12', $attrs.class ?? '')">
		<div class="h-full p-2">
			<Button
				class="w-full justify-start p-0"
				variant="link"
				as-child
			>
				<RouterLink to="/">
					<h2 class="text-2xl font-semibold leading-none tracking-tighter px-4 py-2">Pragmap</h2>
				</RouterLink>
			</Button>
			<div class="h-full flex flex-col justify-between">
				<div class="space-y-4 py-10">
					<div>
						<div class="flex items-center font-semibold text-sm text-muted-foreground px-4 mb-2">
							<UserRound class="h-4 w-4 mr-2" />
							Utilisateurs
						</div>
						<div class="flex flex-col space-y-2">
							<Button
								class="h-8 w-full justify-start"
								:class="{ 'bg-accent text-accent-foreground': route.path === '/users' }"
								variant="ghost"
								as-child
							>
								<RouterLink to="/users">Lister</RouterLink>
							</Button>
							<Button
								class="h-8 w-full justify-start"
								:class="{ 'bg-accent text-accent-foreground': route.path === '/users/create' }"
								variant="ghost"
								as-child
							>
								<RouterLink to="/users/create">Créer</RouterLink>
							</Button>
						</div>
					</div>
					<div>
						<div class="flex items-center font-semibold text-sm text-muted-foreground px-4 mb-2">
							<Handshake class="h-4 w-4 mr-2" />
							Clients
						</div>
						<div class="flex flex-col space-y-2">
							<Button
								class="h-8 w-full justify-start"
								:class="{ 'bg-accent text-accent-foreground': route.path === '/customers' }"
								variant="ghost"
								as-child
							>
								<RouterLink to="/customers">Lister</RouterLink>
							</Button>
							<Button
								class="h-8 w-full justify-start"
								:class="{
									'bg-accent text-accent-foreground': route.path === '/customers/create'
								}"
								variant="ghost"
								as-child
							>
								<RouterLink to="/customers/create">Créer</RouterLink>
							</Button>
						</div>
					</div>
					<div>
						<div class="flex items-center font-semibold text-sm text-muted-foreground px-4 mb-2">
							<FolderKanban class="h-4 w-4 mr-2" />
							Roadmaps
						</div>
						<div class="flex flex-col space-y-2">
							<Button
								class="h-8 w-full justify-start"
								:class="{ 'bg-accent text-accent-foreground': route.path === '/roadmaps' }"
								variant="ghost"
								as-child
							>
								<RouterLink to="/roadmaps">Lister</RouterLink>
							</Button>
							<Button
								class="h-8 w-full justify-start"
								:class="{ 'bg-accent text-accent-foreground': route.path === '/roadmaps/create' }"
								variant="ghost"
								as-child
							>
								<RouterLink to="/roadmaps/create">Créer</RouterLink>
							</Button>
						</div>
					</div>
				</div>
				<div>
					<div class="flex flex-col space-y-2 px-2">
						<p class="font-medium leading-none break-words">
							{{ user.firstName.charAt(0).toUpperCase() + user.firstName.substring(1) }}
							{{ user.lastName.charAt(0).toUpperCase() + user.lastName.substring(1) }}
						</p>
						<p class="text-sm leading-none text-muted-foreground break-words">
							{{ user.email }}
						</p>
					</div>
					<Separator class="my-4" />
					<div class="flex flex-col space-y-2">
						<Button
							class="h-8 w-full justify-start"
							:class="{
								'bg-accent text-accent-foreground': route.path === '/profile'
							}"
							variant="ghost"
							as-child
						>
							<RouterLink to="/profile">
								<div class="flex items-center font-semibold">
									<UserRoundCog class="h-4 w-4 mr-2" />
									Profil
								</div>
							</RouterLink>
						</Button>
						<Button
							class="h-8 w-full justify-start"
							variant="ghost"
							as-child
						>
							<RouterLink to="/logout">
								<div class="flex items-center font-semibold">
									<LogOut class="h-4 w-4 mr-2" />
									Déconnexion
								</div>
							</RouterLink>
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
