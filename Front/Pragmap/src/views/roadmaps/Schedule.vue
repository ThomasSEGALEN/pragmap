<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { roadmapService } from '@/services'

const { id } = useRoute().params as { id: string }

const roadmapData = ref()

onMounted(async () => (roadmapData.value = JSON.parse((await roadmapService.getById(id)).data)))
</script>

<template>
	<pre>{{ roadmapData }}</pre>
</template>
