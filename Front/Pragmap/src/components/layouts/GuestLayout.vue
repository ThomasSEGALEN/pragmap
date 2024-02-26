<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-vue-next'
import { Toaster } from '@/components/ui/toast'

defineProps<{ theme: string }>()
defineEmits(['toggleTheme'])
</script>

<template>
	<Button
		class="h-fit fixed top-0 right-0 p-2.5 m-6"
		variant="ghost"
		@click="$emit('toggleTheme')"
	>
		<Sun
			v-if="theme === 'light'"
			class="h-5 w-5"
		/>
		<Moon
			v-else
			class="h-5 w-5"
		/>
	</Button>
	<div class="h-screen flex justify-center items-center p-6">
		<slot />
		<Toaster />
	</div>
</template>
