<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaginationStore, type CustomersData } from '@/stores'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const { getPageIndex, getPageSize, getCustomersData } = usePaginationStore()
const data = ref<Array<CustomersData>>([])

data.value = await getCustomersData()

watch(
	[() => getPageIndex(), () => getPageSize()],
	async () => (data.value = await getCustomersData())
)
</script>

<template>
	<DataTable
		:data="data"
		:columns="columns"
	/>
</template>
