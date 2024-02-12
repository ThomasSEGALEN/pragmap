<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePaginationStore } from '@/stores'
import type { IGetCustomer } from '@/types'
import { Layout } from '@/components/layouts'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './columns'

const { getPageIndex, getPageSize, getDataCustomer } = usePaginationStore()
const data = ref<Array<IGetCustomer>>([])
onMounted(async () => {
	data.value = await getDataCustomer()
})
watch(
	() => getPageIndex(),
	async () => {
		const customers = await getDataCustomer()

		data.value = customers
	}
)
watch(
	() => getPageSize(),
	async () => {
		const customers = await getDataCustomer()

		data.value = customers
	}
)
</script>

<template>
	<Layout>
		<DataTable
			:data="data"
			:columns="columns"
		/>
	</Layout>
</template>
