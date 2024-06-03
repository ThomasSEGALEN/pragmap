<template>
	<g-gantt-chart chart-start="2021-07-12 12:00" chart-end="2021-07-14 12:00" precision="hour" bar-start="myBeginDate"
		bar-end="myEndDate">
		<g-gantt-row label="My row 1" :bars="row1BarList" />
		<g-gantt-row label="My row 2" :bars="row2BarList" />
	</g-gantt-chart>
</template>

<script setup lang="ts">

import { getRoadmapData } from "@/stores";
import { ref } from "vue"
import { useRoute } from "vue-router";

const { id } = useRoute().params as { id: string }
const tasks = ref([])
tasks.value = await getRoadmapData(id, 'task')
console.log(tasks.value)
const row1BarList = ref([
	{
		myBeginDate: "2021-07-13 13:00",
		myEndDate: "2021-07-13 19:00",
		ganttBarConfig: {
			// each bar must have a nested ganttBarConfig object ...
			id: "unique-id-1", // ... and a unique "id" property
			label: "Lorem ipsum dolor"
		}
	}
])
const row2BarList = ref([
	{
		myBeginDate: "2021-07-13 00:00",
		myEndDate: "2021-07-14 02:00",
		ganttBarConfig: {
			id: "another-unique-id-2",
			hasHandles: true,
			label: "Hey, look at me",
			style: {
				// arbitrary CSS styling for your bar
				background: "#e09b69",
				borderRadius: "20px",
				color: "black"
			},
			class: "foo" // you can also add CSS classes to your bars!
		}
	}
])
</script>
