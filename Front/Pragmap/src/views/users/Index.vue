<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePaginationStore } from '@/stores'
import type { IGetUser } from '@/types'
import { Layout } from '@/components/layouts'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const { getPageIndex, getPageSize, getUsersData } = usePaginationStore()
const data = ref<Array<IGetUser>>([])
onMounted(async () => (data.value = await getUsersData()))
watch([() => getPageIndex(), () => getPageSize()], async () => (data.value = await getUsersData()))
</script>

<template>
	<Layout>
		<template #header>
			<h1>Liste des utilisateurs</h1>
		</template>
		<DataTable
			:data="data"
			:columns="columns"
		/>
	</Layout>
</template>
