<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaginationStore, type RoadmapsData } from '@/stores'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const { getPageIndex, getPageSize, getRoadmapsData } = usePaginationStore()
const data = ref<Array<RoadmapsData>>([])

data.value = await getRoadmapsData()

watch(
	[() => getPageIndex(), () => getPageSize()],
	async () => (data.value = await getRoadmapsData())
)
</script>

<template>
	<DataTable
		:data="data"
		:columns="columns"
	/>
</template>
