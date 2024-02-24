<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePaginationStore } from '@/stores'
import type { IGetCustomer } from '@/types'
import { Layout } from '@/components/layouts'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const { getPageIndex, getPageSize, getCustomersData } = usePaginationStore()
const data = ref<Array<IGetCustomer>>([])
onMounted(async () => (data.value = await getCustomersData()))
watch(
	[() => getPageIndex(), () => getPageSize()],
	async () => (data.value = await getCustomersData())
)
</script>

<template>
	<Layout>
		<template #header>
			<h1>Liste des clients</h1>
		</template>
		<DataTable
			:data="data"
			:columns="columns"
		/>
	</Layout>
</template>
