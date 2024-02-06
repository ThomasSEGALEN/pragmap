<template>
	<RouterView v-slot="{ Component }">
		<component :is="Component" />
	</RouterView>
</template>
