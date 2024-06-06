<script setup lang="ts">
import { ref } from 'vue'
import { getUsersData, type UsersData } from '@/stores'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './partials/columns'

const data = ref<Array<UsersData>>([])
data.value = await getUsersData()
</script>

<template>
	<DataTable
		:data="data"
		:columns="columns"
	/>
</template>
