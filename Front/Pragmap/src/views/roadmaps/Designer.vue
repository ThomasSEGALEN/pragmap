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

const { id } = useRoute().params as { id: string }
const elements = ref<Elements>([])
signalRService.startConnection()
const selectedNodeId = ref(null)
const selectedNode = computed(() => elements.value.find((node) => node.id === selectedNodeId.value))
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
