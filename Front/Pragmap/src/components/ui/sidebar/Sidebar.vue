<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	ChevronDown,
	ChevronUp,
	FolderKanban,
	Handshake,
	LogOut,
	UserRound,
	UserRoundCog
} from 'lucide-vue-next'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { RouterLink } from 'vue-router'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/stores'

const { user } = useAuthStore()
const isUserOpen = useLocalStorage('isUserOpen', true)
const isCustomerOpen = useLocalStorage('isCustomerOpen', true)
const isRoadmapOpen = useLocalStorage('isRoadmapOpen', true)
</script>

<template>
	<div :class="cn('pb-12', $attrs.class ?? '')">
		<div class="h-full p-2">
			<RouterLink to="/">
				<h2 class="text-2xl font-semibold leading-none tracking-tighter px-4 py-2">Pragmap</h2>
			</RouterLink>
			<div class="h-full flex flex-col justify-between">
				<div class="space-y-4 py-10 px-4">
					<Collapsible v-model:open="isUserOpen">
						<CollapsibleTrigger class="flex justify-between items-center mb-2">
							<div class="flex items-center font-semibold text-sm mr-2">
								<UserRound class="h-4 w-4 mr-2" />
								Utilisateurs
							</div>
							<ChevronDown
								v-if="!isUserOpen"
								class="h-4 w-4"
							/>
							<ChevronUp
								v-else
								class="h-4 w-4"
							/>
						</CollapsibleTrigger>
						<CollapsibleContent class="flex flex-col space-y-2">
							<RouterLink to="/users">
								<Button
									variant="ghost"
									class="h-8 w-full justify-start"
								>
									Lister
								</Button>
							</RouterLink>
							<RouterLink to="/users/create">
								<Button
									variant="ghost"
									class="h-8 w-full justify-start"
								>
									Créer
								</Button>
							</RouterLink>
						</CollapsibleContent>
					</Collapsible>
					<Collapsible v-model:open="isCustomerOpen">
						<CollapsibleTrigger class="flex justify-between items-center mb-2">
							<div class="flex items-center font-semibold text-sm mr-2">
								<Handshake class="h-4 w-4 mr-2" />
								Clients
							</div>
							<ChevronDown
								v-if="!isCustomerOpen"
								class="h-4 w-4"
							/>
							<ChevronUp
								v-else
								class="h-4 w-4"
							/>
						</CollapsibleTrigger>
						<CollapsibleContent class="flex flex-col space-y-2">
							<RouterLink to="/customers">
								<Button
									variant="ghost"
									class="h-8 w-full justify-start"
								>
									Lister
								</Button>
							</RouterLink>
							<RouterLink to="/customers/create">
								<Button
									variant="ghost"
									class="h-8 w-full justify-start"
								>
									Créer
								</Button>
							</RouterLink>
						</CollapsibleContent>
					</Collapsible>
					<Collapsible v-model:open="isRoadmapOpen">
						<CollapsibleTrigger class="flex justify-between items-center mb-2">
							<div class="flex items-center font-semibold text-sm mr-2">
								<FolderKanban class="h-4 w-4 mr-2" />
								Roadmaps
							</div>
							<ChevronDown
								v-if="!isRoadmapOpen"
								class="h-4 w-4"
							/>
							<ChevronUp
								v-else
								class="h-4 w-4"
							/>
						</CollapsibleTrigger>
						<CollapsibleContent class="flex flex-col space-y-2">
							<RouterLink to="/roadmaps">
								<Button
									variant="ghost"
									class="h-8 w-full justify-start"
								>
									Lister
								</Button>
							</RouterLink>
							<RouterLink to="/roadmaps/create">
								<Button
									variant="ghost"
									class="h-8 w-full justify-start"
								>
									Créer
								</Button>
							</RouterLink>
						</CollapsibleContent>
					</Collapsible>
				</div>
				<div>
					<div class="flex flex-col space-y-2 px-2">
						<p class="font-medium leading-none break-words">
							{{ user.firstName }} {{ user.lastName }}
						</p>
						<p class="text-sm leading-none text-muted-foreground break-words">
							{{ user.email }}
						</p>
					</div>
					<Separator class="my-4" />
					<div class="flex flex-col space-y-2">
						<RouterLink to="/profile">
							<Button
								variant="ghost"
								class="h-8 w-full justify-start"
							>
								<div class="flex items-center font-semibold">
									<UserRoundCog class="h-4 w-4 mr-2" />
									Profil
								</div>
							</Button>
						</RouterLink>
						<RouterLink to="/logout">
							<Button
								variant="ghost"
								class="h-8 w-full justify-start"
							>
								<div class="flex items-center font-semibold">
									<LogOut class="h-4 w-4 mr-2" />
									Déconnexion
								</div>
							</Button>
						</RouterLink>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
