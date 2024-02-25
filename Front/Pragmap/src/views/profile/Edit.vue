<script setup lang="ts">
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
console.log(authStore.user)
</script>

<template>
	<div>Profile page</div>
</template>
