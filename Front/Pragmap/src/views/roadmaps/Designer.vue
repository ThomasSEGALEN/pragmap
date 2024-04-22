<script setup lang="ts">
import { ref, computed, reactive, toRefs } from 'vue'
import {
	type Elements,
	useVueFlow,
	useGetPointerPosition,
	VueFlow,
	type MouseTouchEvent,
	type EdgeMouseEvent,
	type XYPosition,
	type ViewportTransform
} from '@vue-flow/core'
import { MiniMap, Background } from '@vue-flow/additional-components'
import DeliverableNode from './partials/DeliverableNode.vue'
import MilestoneNode from './partials/MilestoneNode.vue'
import TaskNode from './partials/TaskNode.vue'
import { signalRService } from '@/services'
import type { UserPostion } from '@/types/userPosition'
import { HubConnectionState } from '@microsoft/signalr'

signalRService.startConnection()
const selectedNodeId = ref(null)
const selectedNode = computed(() => elements.value.find((node) => node.id === selectedNodeId.value))
const { onConnect, addEdges } = useVueFlow()
onConnect((params) => {
	addEdges([params])
})
let userPositions = reactive<UserPostion[]>([])
let currentUserPosition: UserPostion = {
	userId: '1',
	username: 'JM',
	xPosition: 0,
	yPosition: 0,
	scale: 1
}

const randomNumber = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomUserPosition = () => {
	const random = randomNumber(0, 10)
	if (random > 5) {
		currentUserPosition = {
			userId: Math.random().toString(),
			username: 'User ' + Math.random().toString(),
			xPosition: randomNumber(0, 1000),
			yPosition: randomNumber(0, 1000),
			scale: 1
		}
	}
}
randomUserPosition()

let flowTransform: ViewportTransform = { x: 0, y: 0, zoom: 1 }

const roadmapId = '4c3db0f3-f7cb-4e7c-9b6b-6637d561c41c'
let roadMapMouseMoveTimeout: number | null | undefined = null

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

const connectToRoadmap = async () => {
	while (signalRService.connection.state !== HubConnectionState.Connected) {
		await new Promise((resolve) => setTimeout(resolve, 2000))
		console.log('Waiting for connection')
	}
	signalRService.joinRoadMap(roadmapId)
	signalRService.receiveUserPosition((userPosition) => {
		const existingUserPositionIndex = userPositions.findIndex(
			(up) => up.userId === userPosition.userId
		)
		if (existingUserPositionIndex !== -1) {
			userPositions[existingUserPositionIndex] = userPosition
		} else {
			userPositions.push(userPosition)
		}
	})
}

connectToRoadmap()

const mouseMove = (event: MouseEvent) => {
	if (roadMapMouseMoveTimeout) {
		return
	}
	roadMapMouseMoveTimeout = window.setTimeout(() => {
		console.log(event.offsetX, flowTransform.x, flowTransform.zoom)

		currentUserPosition.scale = 1 //flowTransform.zoom;
		currentUserPosition.xPosition = event.offsetX //- flowTransform.x * flowTransform.zoom) / flowTransform.zoom;
		currentUserPosition.yPosition = event.offsetY //- flowTransform.y * flowTransform.zoom) / flowTransform.zoom;
		signalRService.updateUserPosition(roadmapId, currentUserPosition)
		if (roadMapMouseMoveTimeout) {
			clearTimeout(roadMapMouseMoveTimeout)
			roadMapMouseMoveTimeout = null
		}
	}, 0)
}

const handleMove = (moveEvent: { event: any; flowTransform: ViewportTransform }) => {
	flowTransform = moveEvent.flowTransform
}

// Convert the reactive object to refs
let uuuserPositions = toRefs(userPositions)
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
			@pane-mouse-move="mouseMove"
			@move="handleMove"
		>
			<div
				v-for="(userPosition, index) in userPositions"
				:key="index"
				class="user-cursor"
				:style="{
					left: userPosition.xPosition + 'px',
					top: userPosition.yPosition + 'px',
					scale: userPosition.scale
				}"
			>
				<span>{{ userPosition.username }}</span>
			</div>
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
.user-cursor {
	position: absolute;
	z-index: 99999;
	display: flex;
	flex-direction: column;
	align-items: center;
	pointer-events: none;
	background-color: #bababa;
	width: 32px;
	height: 32px;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-cursor span {
	font-size: 12px;
}

.vue-flow {
	&:has(.tacheNode:hover),
	&:has(.jalonNode:hover),
	&:has(.livrableNode:hover) {
		.user-cursor {
			display: none;
		}
	}
}

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
