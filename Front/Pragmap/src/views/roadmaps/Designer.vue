<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { type Elements, useVueFlow, VueFlow } from '@vue-flow/core'
import { MiniMap, Background } from '@vue-flow/additional-components'
import { roadmapService } from '@/services'
import useDragAndDrop from './partials/useDragAndDrop'

const { id } = useRoute().params as { id: string }
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
	const data = {
		id: id,
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
		class="h-full w-full relative dndflow"
		@drop="onDrop"
	>
		<div class="navbar">
			<button @click="saveNode()">Save</button>
			<button @click="importNode()">Load</button>

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
		</div>

		<VueFlow
			v-model="elements"
			fit-view-on-init
			@dragover="onDragOver($event as DragEvent)"
			@dragleave="onDragLeave"
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
			<label>Nom</label>
			<input v-model="selectedNode.label" />

			<label>Description</label>
			<textarea
				v-model="selectedNode.data['description']"
				class="w-full"
			></textarea>

			<label>Start</label>
			<input
				type="checkbox"
				v-model="selectedNode.data['start']"
			/>

			<label>Duration</label>
			<input
				type="number"
				v-model="selectedNode.data['duration']"
			/>

			<label>Progress</label>
			<input
				type="number"
				v-model="selectedNode.data['progress']"
			/>

			<button @click="selectedNodeId = null">Close</button>
		</div>
	</div>
</template>

<style scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	background-color: #f8f8f8;
}

.settingsWindow {
	position: absolute;
	right: 0;
	top: 0;
	width: 300px;
	height: 46.1rem;
	background: #f8f8f8;
	border-left: 1px solid #ccc;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	margin-top: 2.5rem;
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
