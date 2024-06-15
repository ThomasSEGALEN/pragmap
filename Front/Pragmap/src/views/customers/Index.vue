<script setup lang="ts">
import { ref } from 'vue'
import { getCustomersData, type CustomersData } from '@/stores'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const data = ref<Array<CustomersData>>([])
data.value = await getCustomersData()
</script>

<template>
	<DataTable
		:data="data"
		:columns="columns"
	/>
</template>
