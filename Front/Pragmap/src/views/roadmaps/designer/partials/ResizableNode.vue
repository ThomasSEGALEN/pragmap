<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { NodeResizer } from '@vue-flow/node-resizer'

defineProps(['data'])
</script>

<template>
	<NodeResizer
		:min-width="100"
		:min-height="30"
	/>
	<Handle
		type="target"
		:position="Position.Right"
	/>
	<div style="padding: 10px">{{ data.label }}</div>
	<Handle
		type="source"
		:position="Position.Left"
	/>
</template>
