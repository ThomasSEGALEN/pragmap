<script setup lang="ts">
import { ref, computed } from 'vue'
import { type Elements, useVueFlow, VueFlow } from '@vue-flow/core'
import { MiniMap, Background } from '@vue-flow/additional-components'
import DeliverableNode from './partials/DeliverableNode.vue'
import MilestoneNode from './partials/MilestoneNode.vue'
import TaskNode from './partials/TaskNode.vue'

const selectedNodeId = ref(null)
const selectedNode = computed(() => elements.value.find((node) => node.id === selectedNodeId.value))
const { onConnect, addEdges } = useVueFlow()
onConnect((params) => {
	addEdges([params])
})
const elements = ref<Elements>([])
let json = JSON.stringify(elements.value)
const addNode = (type: string) => {
	const id = (elements.value.length + 1).toString() as unknown as string
	const lastNode = elements.value[elements.value.length - 1] as
		| { position: { x: number; y: number } }
		| undefined
	const newX = lastNode ? lastNode.position.x + 20 : window.innerWidth / 2
	const newY = lastNode ? lastNode.position.y - 20 : window.innerHeight / 2

	elements.value.push({
		type: type,
		data: {
			name: `Nouveau ` + type,
			description: `Description de ` + type,
			duration: 0,
			start: false
		},
		position: {
			x: newX,
			y: newY
		},
		animated: true,
		id: id,
		label: type
	})
}
const saveNode = () => {
	json = JSON.stringify(elements.value)
	console.log(json)
}
const importNode = () => {
	if (json) {
		elements.value = JSON.parse(json)
	}
}
</script>

<template>
	<div class="w-full relative">
		<div class="navbar">
			<button @click="addNode('tache')">Tache</button>
			<button @click="addNode('jalon')">Jalon</button>
			<button @click="addNode('livrable')">Livrable</button>
			<button @click="saveNode()">Save</button>
			<button @click="importNode()">Load</button>
		</div>
		<VueFlow
			v-model="elements"
			class="vue-flow-basic-example"
			:default-zoom="1"
			:min-zoom="0.2"
			:max-zoom="4"
			style="height: 80vh"
		>
			<Background
				pattern-color="#aaa"
				:gap="8"
			/>
			<MiniMap />
			<template #node-tache="nodeProps">
				<TaskNode
					v-bind="nodeProps"
					@node-clicked="selectedNodeId = $event"
				/>
			</template>
			<template #node-jalon="nodeProps">
				<MilestoneNode
					v-bind="nodeProps"
					@node-clicked="selectedNodeId = $event"
				/>
			</template>
			<template #node-livrable="nodeProps">
				<DeliverableNode
					v-bind="nodeProps"
					@node-clicked="selectedNodeId = $event"
				/>
			</template>
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
