<script setup lang="ts">
import { Handle, Position, useNode } from '@vue-flow/core'
import { FileText } from 'lucide-vue-next'

defineEmits(['nodeClicked'])

const { node } = useNode()
</script>

<template>
	<div
		class="livrableNode"
		@click="$emit('nodeClicked', node.id)"
	>
		<p>{{ node.data.name }}</p>
		<Handle
			type="source"
			:position="Position.Top"
		/>
		<FileText />
	</div>
</template>

<style scoped>
.livrableNode {
	height: 100%;
	width: 100%;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 10px;
	background: white;
	border: 1px solid green;
	border-radius: 4px;
	justify-content: center;
	align-items: center;
}
</style>
