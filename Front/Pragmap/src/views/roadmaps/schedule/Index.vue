<template>
	<div
		id="app"
		class="w-full"
	>
		<GanttChart :id="id" />
	</div>
</template>

<script lang="ts" setup>
import GanttChart from './Gantt.vue'
import { useRoute } from 'vue-router'

const { id } = useRoute().params as { id: string }
</script>
