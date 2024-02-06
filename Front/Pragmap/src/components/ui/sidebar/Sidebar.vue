<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const mode = useColorMode()
const switchMode = () => {
	mode.value = mode.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
	<div :class="cn('pb-12', $attrs.class ?? '')">
		<div class="p-4">
			<div class="flex items-center justify-between mb-10">
				<RouterLink to="/">
					<h2 class="text-lg font-semibold tracking-tight">Pragmap</h2>
				</RouterLink>
				<Button
					class=""
					variant="outline"
					size="icon"
					@click="switchMode"
				>
					<Sun
						v-if="mode === 'light'"
						class="w-4 h-4"
					/>
					<Moon
						v-if="mode === 'dark'"
						class="w-4 h-4"
					/>
				</Button>
			</div>
			<div class="space-y-4">
				<div>
					<h2 class="text-lg font-semibold tracking-tight mr-2">Utilisateurs</h2>
					<RouterLink to="/users">
						<Button
							variant="ghost"
							class="h-8 w-full justify-start"
						>
							Liste
						</Button>
					</RouterLink>
					<RouterLink to="/users/create">
						<Button
							variant="ghost"
							class="h-8 w-full justify-start"
						>
							Création
						</Button>
					</RouterLink>
				</div>
				<div>
					<h2 class="text-lg font-semibold tracking-tight mr-2">Clients</h2>
					<RouterLink to="/users">
						<Button
							variant="ghost"
							class="h-8 w-full justify-start"
						>
							Liste
						</Button>
					</RouterLink>
					<RouterLink to="/users/create">
						<Button
							variant="ghost"
							class="h-8 w-full justify-start"
						>
							Création
						</Button>
					</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>
