<script setup lang="ts">
import { Handle, Position, useNode } from '@vue-flow/core'
import { LayoutList } from 'lucide-vue-next'

defineEmits(['nodeClicked'])
const { node } = useNode()
</script>

<template>
	<div
		class="tacheNode"
		v-on:click="$emit('nodeClicked', node.id)"
	>
		<p>{{ node.data.name }}</p>
		<Handle
			class="handle"
			type="source"
			:position="Position.Left"
		/>
		<Handle
			class="handle"
			type="target"
			:position="Position.Right"
		/>
		<Handle
			class="handle"
			type="source"
			:position="Position.Bottom"
		/>
		<LayoutList />
	</div>
</template>

<style scoped>
.tacheNode {
	padding: 1rem;
	display: flex;
	flex-direction: column-reverse;
	background: white;
	border-radius: 4px;
	border: 1px solid black;
	justify-content: center;
	align-items: center;
}
.handle:before {
	visibility: hidden;
}

.handle:hover {
	visibility: visible;
}
#text {
	border: none;
	text-align: center;
}
</style>
