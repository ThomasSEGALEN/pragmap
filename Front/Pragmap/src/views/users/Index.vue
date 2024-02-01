<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePaginationStore } from '@/stores'
import type { IGetUser } from '@/types'
import { Layout } from '@/components/layouts'
import { DataTable } from '@/components/ui/datatable'
import { columns } from './columns'

const { getPageIndex, getPageSize, getData } = usePaginationStore()
const data = ref<Array<IGetUser>>([])
onMounted(async () => {
  data.value = await getData()
})
watch(
  () => getPageIndex(),
  async () => {
    const users = await getData()

    data.value = users
  }
)
watch(
  () => getPageSize(),
  async () => {
    const users = await getData()

    data.value = users
  }
)
</script>

<template>
  <Layout>
    <DataTable :data="data" :columns="columns" />
  </Layout>
</template>
