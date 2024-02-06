<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePaginationStore } from '@/stores'
import type { IGetUser } from '@/types'
import { Layout } from '@/components/layouts'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './columns'

const { getPageIndex, getPageSize, getUserData } = usePaginationStore()
const data = ref<Array<IGetUser>>([])
onMounted(async () => {
	data.value = await getUserData()
})
watch([() => getPageIndex(), () => getPageSize(), data], async () => {
	const users = await getUserData()

	data.value = users
})
</script>

<template>
	<Layout>
		<DataTable
			:data="data"
			:columns="columns"
		/>
	</Layout>
</template>
