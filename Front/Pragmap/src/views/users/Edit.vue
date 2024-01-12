<script setup lang="ts">
import { Layout } from '@/components/layouts'

defineProps({
  id: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <Layout>
    <div>Users edit {{ id }}</div>
  </Layout>
</template>
