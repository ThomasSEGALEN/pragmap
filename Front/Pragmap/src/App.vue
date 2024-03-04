<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { GuestLayout, Layout } from '@/components/layouts'

const theme = useColorMode()
const toggleTheme = () => (theme.value = theme.value === 'light' ? 'dark' : 'light')
</script>

<template>
	<RouterView v-slot="{ Component, route }">
		<Suspense>
			<GuestLayout
				v-if="!route.meta.requiresAuth"
				:theme="theme"
				@toggle-theme="toggleTheme"
			>
				<Transition
					name="fade"
					mode="out-in"
				>
					<component :is="Component" />
				</Transition>
			</GuestLayout>
			<Layout
				v-else
				:theme="theme"
				@toggle-theme="toggleTheme"
			>
				<template #header>
					<h1 class="font-semibold leading-none text-xl">{{ route.meta.name }}</h1>
				</template>
				<Transition
					name="fade"
					mode="out-in"
				>
					<component :is="Component" />
				</Transition>
			</Layout>
		</Suspense>
	</RouterView>
</template>
