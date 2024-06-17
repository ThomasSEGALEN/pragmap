<script setup lang="ts">
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'
import { NodeResizer } from '@vue-flow/node-resizer'

const props = defineProps(['id', 'data'])

const actions = ['👎', '✋', '👍']

const { updateNodeData } = useVueFlow()
</script>

<template>
	<NodeResizer
		:min-width="100"
		:min-height="30"
	/>

	<Handle
		type="target"
		:position="Position.Left"
	/>
	<div style="padding: 10px">{{ data.label }}</div>
	<Handle
		type="source"
		:position="Position.Right"
	/>

	<NodeToolbar
		:is-visible="data.toolbarVisible"
		:position="data.toolbarPosition"
	>
		<button
			v-for="action of actions"
			:key="action"
			type="button"
			class="bg-blue-500 rounded-md"
			:class="action === data.action ? 'bg-red-500' : ''"
			@click="updateNodeData(props.id, { action })"
		>
			{{ action }}
		</button>
	</NodeToolbar>
</template>
