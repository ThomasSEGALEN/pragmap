<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { GuestLayout, Layout } from '@/components/layouts'

const theme = useColorMode()
const selectTheme = (value: string) => (theme.value = value as 'light' | 'dark')
</script>

<template>
	<RouterView v-slot="{ Component, route }">
		<Suspense>
			<GuestLayout
				v-if="!route.meta.requiresAuth"
				:theme="theme"
				@select-theme="selectTheme"
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
				@select-theme="selectTheme"
			>
				<template #header>
					<h1>{{ route.meta.name }}</h1>
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
