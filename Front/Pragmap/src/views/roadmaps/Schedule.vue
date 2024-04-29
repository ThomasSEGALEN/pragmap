<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getRoadmapData } from '@/stores'

const { id } = useRoute().params as { id: string }

const tasks = ref()

onMounted(async () => (tasks.value = await getRoadmapData(id, 'task')))
</script>

<template>
	<pre>{{ tasks }}</pre>
</template>
