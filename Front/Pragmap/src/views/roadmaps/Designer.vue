<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { type Elements, useVueFlow, VueFlow } from '@vue-flow/core'
import { MiniMap, Background } from '@vue-flow/additional-components'
import { roadmapService } from '@/services'
import useDragAndDrop from './partials/useDragAndDrop'

const { id } = defineProps<{
	id: string
}>()

const elements = ref<Elements>([])
const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, isDragOver, onDragStart } = useDragAndDrop(elements)
onConnect((params) => {
	addEdges([params])
})
const selectedNodeId = ref(null)
const selectedNode = computed(() => elements.value.find((node) => node.id === selectedNodeId.value))
onMounted(async () => {
	const data = (await roadmapService.getById(id)).data

	elements.value = JSON.parse(data) ?? []
})
const saveNode = async () => {
	console.log(elements.value)

	const data = {
		id: id,
		name: 'Pragmap',
		data: JSON.stringify(elements.value)
	}

	await roadmapService.update(data.id, data)
}
const importNode = async () => {
	const nodes = (await roadmapService.getById(id)).data

	elements.value = JSON.parse(nodes)
}
</script>

<template>
	<div
		class="h-[90%] w-full relative dndflow"
		@drop="onDrop"
	>
		<div class="navbar">
			<button @click="saveNode()">Save</button>
			<button @click="importNode()">Load</button>
		</div>

		<aside>
			<div class="flex gap-4 nodes">
				<div
					class="vue-flow__node-input"
					:draggable="true"
					@dragstart="onDragStart($event, 'task')"
				>
					Tâche
				</div>
				<div
					class="vue-flow__node-default"
					:draggable="true"
					@dragstart="onDragStart($event, 'deliverable')"
				>
					Livrable
				</div>
				<div
					class="vue-flow__node-output"
					:draggable="true"
					@dragstart="onDragStart($event, 'milestone')"
				>
					Jalon
				</div>
			</div>
		</aside>

		<VueFlow
			v-model="elements"
			@dragover="onDragOver($event as DragEvent)"
			@dragleave="onDragLeave"
			fit-view-on-init
			@node-click="(e: any) => (selectedNodeId = e.node.id)"
		>
			<Background
				:size="1"
				:gap="20"
				pattern-color="#BDBDBD"
				:style="{
					backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
					transition: 'background-color 0.2s ease'
				}"
			>
				<slot />
			</Background>
			<MiniMap />
		</VueFlow>

		<div
			v-if="selectedNodeId && selectedNode"
			class="settingsWindow"
		>
			<h2>Node Settings</h2>
			<div
				v-for="(value, key) in selectedNode.data"
				:key="key"
			>
				<label>{{ key }}</label>
				<textarea
					v-if="typeof key === 'string' && key === 'description'"
					v-model="selectedNode.data[key]"
					class="description"
				></textarea>
				<input
					v-else-if="typeof value === 'boolean'"
					type="checkbox"
					v-model="selectedNode.data[key]"
				/>
				<input
					v-else-if="value instanceof Date"
					type="date"
					v-model="selectedNode.data[key]"
				/>
				<input
					v-else
					v-model="selectedNode.data[key]"
				/>
			</div>
			<button @click="selectedNodeId = null">Close</button>
		</div>
	</div>
</template>

<style scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	padding: 10px;
	background-color: #f8f8f8;
}
.settingsWindow {
	position: absolute;
	right: 0;
	top: 0;
	width: 300px;
	height: 100%;
	background: #f8f8f8;
	border-left: 1px solid #ccc;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}
.settingsWindow h2 {
	color: #333;
	margin-bottom: 1rem;
}
.settingsWindow div {
	width: 100%;
	padding: 0.5rem;
	background: #fff;
	margin-bottom: 0.5rem;
	border-radius: 4px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.settingsWindow label {
	display: block;
	margin-bottom: 0.5rem;
	color: #666;
}
.settingsWindow input {
	width: 100%;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}
.settingsWindow button {
	margin-top: 1rem;
	padding: 0.5rem 1rem;
	background: #333;
	color: #fff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}
.settingsWindow .description {
	font-size: 0.8rem;
	height: 4rem;
}
</style>
