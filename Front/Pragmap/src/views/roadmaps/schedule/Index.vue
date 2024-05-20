<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getRoadmapData } from '@/stores'

const { id } = useRoute().params as { id: string }

const tasks = ref()

tasks.value = await getRoadmapData(id, 'task')
</script>

<template>
	<pre>{{ tasks }}</pre>
</template>
