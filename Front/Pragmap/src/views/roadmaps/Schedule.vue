<template>

<div id="chart" class="w-full h-full">
        <apexchart type="rangeBar" height="350" :options="chartOptions" :series="series"></apexchart>
</div>
    
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getRoadmapData } from '@/stores'
  import moment from 'moment' 

  const { id } = useRoute().params as { id: string }


  const tasks = ref([])
  const series = ref([])
        
  onMounted(async () => {
  tasks.value = await getRoadmapData(id, 'task')

  series.value = [{
    data: tasks.value.map(task => ({
      x: task.label,
      y: [
        new Date('2019-02-27').getTime(),
        new Date('2019-03-04').getTime()
      ],
      fillColor: '#008FFB' // replace with the actual color for each task
    }))
  }]
})
   const chartOptions = {
            chart: {
              height: 350,
              type: 'rangeBar'
            },
            plotOptions: {
              bar: {
                horizontal: true,
                distributed: true,
                dataLabels: {
                  hideOverflowingLabels: false
                }
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function(val, opts) {
                var label = opts.w.globals.labels[opts.dataPointIndex]
                var a = moment(val[0])
                var b = moment(val[1])
                var diff = b.diff(a, 'days')
                return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
              },
              style: {
                colors: ['#f3f4f5', '#fff']
              }
            },
            xaxis: {
              type: 'datetime'
            },
            yaxis: {
              show: false
            },
            grid: {
              row: {
                colors: ['#f3f4f5', '#fff'],
                opacity: 1
              }
            }
          }
  
</script>