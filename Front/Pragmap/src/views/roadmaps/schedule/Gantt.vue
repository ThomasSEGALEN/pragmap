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

interface TargetData {
  id: string | null
  name: string | null
  parent: string | null
  actualStart: number | null
  actualEnd: number | null
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

      if (!source.data.startDate) {
        source.data.startDate = source.data.endDate
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
const endData  = transformTasks(targetJsonArray) 

interface TransformedTask {
  id: string;
  name: string;
  progressValue: string;
  actualStart: number | null;
  actualEnd: number | null;
  baselineStart: number | null;
  baselineEnd: number | null;
  rowHeight: number;
  children?: TransformedChild[];
}

interface TransformedChild {
  name: string;
  parent: string;
  actualStart: number;
  actualEnd: number;
  baselineStart: number | null;
  baselineEnd: number | null;
}

function transformTasks(tasks: any[]): TransformedTask[] {
  const taskMap: { [key: string]: TransformedTask } = {};
  // Initialize the map with tasks that don't have a parent
  tasks.forEach(task => {
    if (!task.parent) {
      taskMap[task.id] = {
        id: task.id,
        name: task.name,
        progressValue: task.progressValue,
        actualStart: Date.UTC(new Date(task.actualStart).getUTCFullYear(), new Date(task.actualStart).getUTCMonth(), new Date(task.actualStart).getUTCDate()),
        actualEnd: Date.UTC(new Date(task.actualEnd).getUTCFullYear(), new Date(task.actualEnd).getUTCMonth(), new Date(task.actualEnd).getUTCDate()),
        baselineStart: null,
        baselineEnd: null,
        rowHeight: task.rowHeight,
        children: []
      };
    }
  });

  // Add children to their respective parents
  tasks.forEach(task => {
    if (task.parent) {
      if (taskMap[task.parent]) {
        taskMap[task.parent].children?.push({
          name: task.name,
          parent: task.parent,
          baselineStart: null,
          baselineEnd: null,
          actualStart: Date.UTC(new Date(task.actualStart).getUTCFullYear(), new Date(task.actualStart).getUTCMonth(), new Date(task.actualStart).getUTCDate()),
          actualEnd: Date.UTC(new Date(task.actualEnd).getUTCFullYear(), new Date(task.actualEnd).getUTCMonth(), new Date(task.actualEnd).getUTCDate())
        });
      }
    }
  });

  // Adjust the actualStart and actualEnd for parent tasks based on their children
  Object.values(taskMap).forEach(task => {
    if (task.children && task.children.length > 0) {
      const childActualStarts = task.children.map(child => child.actualStart);
      const childActualEnds = task.children.map(child => child.actualEnd);
      task.actualStart = Math.min(...childActualStarts);
      task.actualEnd = Math.max(...childActualEnds);
    }
  });

  // Convert the map back to an array
  const transformedTasks = Object.values(taskMap);
  transformedTasks.sort((a, b) => {
    if (a.actualStart == null && b.actualStart == null) return 0;
    if (a.actualStart == null) return -1;
    if (b.actualStart == null) return 1;
    return a.actualStart - b.actualStart;
  });
  return transformedTasks;
}

onMounted(() => {
  anychart.onDocumentReady(function () {
    // create a data tree
    var treeData = anychart.data.tree((endData), 'as-tree')

    // map the data
    var mapping = treeData.mapAs()

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
