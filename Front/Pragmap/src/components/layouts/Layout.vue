<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
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
import { useAuthStore } from '@/stores'
import { ref } from 'vue'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

const theme = useColorMode()
const selectTheme = (value: string) => (theme.value = value as 'light' | 'dark')
const isToggled = ref(false)
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
				class="w-full flex justify-between items-center text-xl font-semibold leading-none tracking-tighter p-4 border-b bg-background z-50"
			>
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
						<DropdownMenuGroup>
							<RouterLink to="/profile">
								<DropdownMenuItem>Profil</DropdownMenuItem>
							</RouterLink>
							<DropdownMenuItem as-child>
								<Select
									name="theme"
									:default-value="theme"
									@update:model-value="selectTheme"
								>
									<SelectTrigger
										class="h-fit w-full border-none outline-none focus:outline-none ring-0 focus:ring-0 ring-offset-0 focus:ring-offset-0 px-2 py-1.5"
									>
										<SelectValue
											:placeholder="theme === 'light' ? 'Thème clair' : 'Thème sombre'"
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="light">Thème clair </SelectItem>
											<SelectItem value="dark">Thème sombre</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<RouterLink to="/logout">
							<DropdownMenuItem>Déconnexion</DropdownMenuItem>
						</RouterLink>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>
			<ResponsiveSidebar
				class="z-50"
				:is-toggled="isToggled"
			/>
			<main class="h-fit w-full flex justify-center p-6 md:p-12">
				<slot />
			</main>
		</div>
		<Toaster />
	</div>
</template>
