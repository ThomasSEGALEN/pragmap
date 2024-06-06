<script setup lang="ts">
import { getRoadmapData } from '@/stores'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { format, min, max, differenceInDays, addDays } from 'date-fns'

const { id } = useRoute().params as { id: string }
const tasks = ref([])
tasks.value = await getRoadmapData(id, 'task')
const transformedTasks = tasks.value.map((task) => ({
	myBeginDate: format(new Date((task as { startDate: string }).startDate), 'yyyy-MM-dd HH:mm'),
	myEndDate: format(new Date((task as { endDate: string }).endDate), 'yyyy-MM-dd HH:mm'),
	ganttBarConfig: {
		id: `${(task as { id: string }).id}`,
		hasHandles: true,
		label: (task as { label: string }).label,
		style: {
			background: `linear-gradient(90deg, rgba(224, 155, 105, 1) ${(task as { progress: number }).progress}%, rgba(224, 155, 105, 0) ${(task as { progress: number }).progress}%, rgba(211, 211, 211, 1) ${(task as { progress: number }).progress}%)`,
			color: 'black'
		},
		class: 'foo'
	}
}))
let minStartDate = min(transformedTasks.map((task) => new Date(task.myBeginDate)))
let maxEndDate = max(transformedTasks.map((task) => new Date(task.myEndDate)))

if (differenceInDays(maxEndDate, minStartDate) < 1) {
	maxEndDate = addDays(maxEndDate, 1)
}

let sortedTasks = [...transformedTasks].sort((a, b) => {
	return new Date(a.myBeginDate).getTime() - new Date(b.myBeginDate).getTime()
})
let chartStart = format(minStartDate, 'yyyy-MM-dd HH:mm')
let chartEnd = format(maxEndDate, 'yyyy-MM-dd HH:mm')

// TODO: Ajouter le jalon sur le côté ou après la dernière tâche
</script>

<template>
	<g-gantt-chart
		:chart-start="chartStart"
		:chart-end="chartEnd"
		bar-start="myBeginDate"
		bar-end="myEndDate"
		class="w-full"
	>
		<g-gantt-row
			v-for="(task, index) in sortedTasks"
			:key="index"
			:bars="[task]"
		/>
	</g-gantt-chart>
</template>
