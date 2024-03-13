<script setup lang="ts">
import { Handle, Position, useNode } from '@vue-flow/core'
import { Trophy } from 'lucide-vue-next'

defineEmits(['nodeClicked'])

const { node } = useNode()
</script>

<template>
	<div
		class="jalonNode"
		@click="$emit('nodeClicked', node.id)"
	>
		<p>{{ node.data.name }}</p>
		<Handle
			type="source"
			:position="Position.Left"
		/>
		<Handle
			type="target"
			:position="Position.Right"
		/>
		<Trophy />
	</div>
</template>

<style scoped>
.jalonNode {
	height: 100%;
	width: 100%;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background: white;
	border: 1px solid yellow;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
}
</style>
