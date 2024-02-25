<script setup lang="ts">
import { GuestLayout, Layout } from './components/layouts'
</script>

<template>
	<RouterView v-slot="{ Component, route }">
		<Suspense>
			<GuestLayout v-if="!route.meta.requiresAuth">
				<Transition
					name="fade"
					mode="out-in"
				>
					<component :is="Component" />
				</Transition>
			</GuestLayout>
			<Layout v-else>
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
			<!-- <template #fallback>Loading...</template> -->
		</Suspense>
	</RouterView>
</template>
