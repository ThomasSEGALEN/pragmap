<script setup lang="ts">
import { Sidebar } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toast'
</script>

<template>
	<div class="h-full flex">
		<Sidebar class="w-72 border-r" />
		<main class="h-fit w-full flex justify-center p-4 md:p-12">
			<slot />
		</main>
		<Toaster />
	</div>
</template>
