<script setup lang="ts">
import { ref } from 'vue'
import { getRoadmapsData, type RoadmapsData } from '@/stores'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const data = ref<Array<RoadmapsData>>([])

data.value = await getRoadmapsData()
</script>

<template>
	<DataTable
		:data="data"
		:columns="columns"
	/>
</template>
