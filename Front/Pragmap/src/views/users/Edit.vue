<script setup lang="ts">
import { Layout } from '@/components/layouts'

defineProps<{ id: string }>()
</script>

<template>
  <Layout>
    <div>Users edit {{ id }}</div>
  </Layout>
</template>
