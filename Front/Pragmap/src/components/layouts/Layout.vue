<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores'
import { Avatar } from '@/components/ui/avatar'
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
import { Menu, X } from 'lucide-vue-next'
import { ResponsiveSidebar, Sidebar } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toast'

defineProps<{ theme: string }>()
defineEmits(['toggleTheme'])

const isToggled = ref<boolean>(false)
const toggleSidebar = () => (isToggled.value = !isToggled.value)
const { user } = useAuthStore()
const getInitials = () =>
	`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`.toUpperCase()
</script>

<template>
	<div class="flex">
		<Sidebar class="fixed h-full min-w-60 hidden md:block border-r z-50 overflow-y-auto" />
		<div class="w-full flex flex-col md:ml-60">
			<header
				v-if="$slots.header"
				class="fixed md:sticky top-0 w-full flex flex-col justify-between items-center text-xl font-semibold leading-none tracking-tighter border-b bg-background p-4 z-50"
			>
				<div class="relative w-full flex flex-row justify-between items-center">
					<Button
						class="md:hidden h-8 w-8"
						variant="ghost"
						size="icon"
						@click="toggleSidebar"
					>
						<Menu v-if="!isToggled" />
						<X v-else />
					</Button>
					<slot name="header" />
					<DropdownMenu>
						<DropdownMenuTrigger as-child>
							<Button
								class="relative h-8 w-8 rounded-full"
								variant="ghost"
							>
								<Avatar class="h-8 w-8">
									{{ getInitials() }}
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							class="w-56"
							align="end"
						>
							<DropdownMenuLabel>
								<div class="flex flex-col space-y-1">
									<p class="text-sm font-medium leading-none break-words">
										{{ user.firstName.charAt(0).toUpperCase() + user.firstName.substring(1) }}
										{{ user.lastName.charAt(0).toUpperCase() + user.lastName.substring(1) }}
									</p>
									<p class="text-xs leading-none text-muted-foreground break-words">
										{{ user.email }}
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup class="space-y-1">
								<DropdownMenuItem as-child>
									<Button
										class="h-8 w-full justify-start font-normal focus-visible:bg-transparent"
										variant="ghost"
										as-child
									>
										<RouterLink to="/profile">Profil</RouterLink>
									</Button>
								</DropdownMenuItem>
								<DropdownMenuItem as-child>
									<Button
										class="h-8 w-full justify-start font-normal focus-visible:bg-transparent"
										variant="ghost"
										@click="$emit('toggleTheme')"
									>
										{{ theme === 'light' ? 'Mode sombre' : 'Mode clair' }}
									</Button>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem as-child>
								<Button
									class="h-8 w-full justify-start font-normal focus-visible:bg-transparent"
									variant="ghost"
									as-child
								>
									<RouterLink to="/logout">Déconnexion</RouterLink>
								</Button>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<ResponsiveSidebar
					class="absolute z-50"
					:is-toggled="isToggled"
				/>
			</header>
			<main class="h-fit w-full flex justify-center p-6 md:p-12 mt-16 md:mt-0">
				<slot />
			</main>
		</div>
		<Toaster />
	</div>
</template>
