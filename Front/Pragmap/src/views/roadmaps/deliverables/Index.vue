<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getRoadmapData, type Node } from '@/stores'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const { id } = useRoute().params as { id: string }
const data = ref<Array<Node>>([])

data.value = await getRoadmapData(id, 'deliverable')
</script>

<template>
	<DataTable
		:data="data"
		:columns="columns"
	/>
</template>
