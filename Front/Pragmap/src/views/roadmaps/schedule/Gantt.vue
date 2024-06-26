<template>
	<div id="container"></div>
</template>

<script lang="ts" setup>
import { getRoadmapDataById } from '@/stores'

import { onMounted, ref } from 'vue'
import 'anychart'
import 'anychart/dist/js/anychart-base.min.js'
import 'anychart/dist/js/anychart-ui.min.js'
import 'anychart/dist/js/anychart-exports.min.js'
import 'anychart/dist/js/anychart-gantt.min.js'
import 'anychart/dist/js/anychart-data-adapter.min.js'
import 'anychart/dist/css/anychart-ui.min.css'
import 'anychart/dist/fonts/css/anychart-font.min.css'

const props = defineProps<{
	id: string
}>()

const tasks = ref([])
tasks.value = await getRoadmapDataById(props.id)

console.log(tasks.value)

interface TargetData {
	id: string | null
	name: string | null
	parent: string | null
	actualStart: number | null
	actualEnd: number | null
	baselineStart: number | null
	baselineEnd: number | null
	progressValue: string | null
	rowHeight: number
}

const transformDataArray = (dataArray: any[]): TargetData[] => {
	return dataArray
		.map((source) => {
			// Fonction pour convertir une date au format YYYY-MM-DD en timestamp Unix en millisecondes
			const dateToTimestamp = (dateString: string | undefined | null): number | null => {
				if (!dateString) return null
				const [year, month, day] = dateString.split('-').map(Number)
				return Date.UTC(year, month - 1, day) // Mois est 0-indexé donc -1
			}

			// Conversion des dates si elles sont présentes dans la source
			const startDate = dateToTimestamp(source.data?.startDate)
			const endDate = dateToTimestamp(source.data?.endDate)

			return {
				id: source.id || null,
				name: source.label || null,
				parent: source.parentNode || null,
				actualStart: startDate,
				actualEnd: endDate,
				baselineStart: startDate,
				baselineEnd: endDate,
				progressValue: (source.data?.progress || '0') + '%',
				rowHeight: 35
			}
		})
		.sort((a, b) => {
			// Trie par actualStart du plus vieux au plus récent
			if (a.actualStart && b.actualStart) {
				return a.actualStart - b.actualStart
			} else if (a.actualStart) {
				return -1
			} else if (b.actualStart) {
				return 1
			} else {
				return 0
			}
		})
}

const targetJsonArray = transformDataArray(tasks.value)
console.log(JSON.stringify(targetJsonArray, null, 2))

onMounted(() => {
	anychart.onDocumentReady(function () {
		// create a data tree
		var treeData = anychart.data.tree(targetJsonArray, 'as-tree', '', { children: 'child_items' })

		// map the data
		var mapping = treeData.mapAs({ actualStart: 'start_date', actualEnd: 'end_date' })

		// create a chart
		var chart = anychart.ganttProject()

		// set the data
		chart.data(mapping)

		// set the container id
		chart.container('container')

		// initiate drawing the chart
		chart.draw()

		// fit elements to the width of the timeline
		chart.fitAll()
	})

	// add bold and italic text settings to all parent items
	// const labelTextSettingsFormatter = (label: any, dataItem: any) => {
	// 	if (dataItem.numChildren()) {
	// 		label.fontWeight('bold').fontStyle('italic')
	// 	}
	// }

	// do pretty formatting for dates in third column
	// const thirdColumnTextFormatter = (data: any) => {
	// 	const field = data.baselineStart

	// 	// format base line text
	// 	if (field) {
	// 		const baselineStart = new Date(field)
	// 		return (
	// 			formatDate(baselineStart.getUTCMonth() + 1) +
	// 			'/' +
	// 			formatDate(baselineStart.getUTCDate()) +
	// 			'/' +
	// 			baselineStart.getUTCFullYear() +
	// 			' ' +
	// 			formatDate(baselineStart.getUTCHours()) +
	// 			':' +
	// 			formatDate(baselineStart.getUTCMinutes())
	// 		)
	// 	}
	// 	// format milestone text
	// 	const actualStart = data.item.get('actualStart')
	// 	const actualEnd = data.item.get('actualEnd')
	// 	if (actualStart === actualEnd || (actualStart && !actualEnd)) {
	// 		const start = new Date(actualStart)
	// 		return (
	// 			formatDate(start.getUTCMonth() + 1) +
	// 			'/' +
	// 			formatDate(start.getUTCDate()) +
	// 			'/' +
	// 			start.getUTCFullYear() +
	// 			' ' +
	// 			formatDate(start.getUTCHours()) +
	// 			':' +
	// 			formatDate(start.getUTCMinutes())
	// 		)
	// 	}
	// 	return ''
	// }

	// do pretty formatting for dates in fourth column
	// const fourthColumnTextFormatter = (item: any) => {
	// 	const field = item.baselineEnd
	// 	if (field) {
	// 		const baselineEnd = new Date(field)
	// 		return (
	// 			formatDate(baselineEnd.getUTCMonth() + 1) +
	// 			'/' +
	// 			formatDate(baselineEnd.getUTCDate()) +
	// 			'/' +
	// 			baselineEnd.getUTCFullYear() +
	// 			' ' +
	// 			formatDate(baselineEnd.getUTCHours()) +
	// 			':' +
	// 			formatDate(baselineEnd.getUTCMinutes())
	// 		)
	// 	}
	// 	return ''
	// }

	// do pretty formatting for passed date unit
	// const formatDate = (dateUnit: number) => {
	// 	return dateUnit < 10 ? '0' + dateUnit : dateUnit.toString()
	// }
})
</script>

<style scoped>
html,
body,
#container {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}
</style>
