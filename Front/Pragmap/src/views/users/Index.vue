<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaginationStore, type UsersData } from '@/stores'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const { getPageIndex, getPageSize, getUsersData } = usePaginationStore()
const data = ref<Array<UsersData>>([])

data.value = await getUsersData()

watch([() => getPageIndex(), () => getPageSize()], async () => (data.value = await getUsersData()))
</script>

<template>
	<DataTable
		:data="data"
		:columns="columns"
	/>
</template>
