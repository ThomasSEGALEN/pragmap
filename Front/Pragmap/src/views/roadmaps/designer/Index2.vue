<script setup lang="ts">
import { ref } from 'vue'
import { Position, useVueFlow, VueFlow, type Elements } from '@vue-flow/core'
// import { Handle, Position, useVueFlow, VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import ResizableNode from './partials/ResizableNode.vue'
import ToolbarNode from './partials/ToolbarNode.vue'

const { onConnect, addEdges, addNodes, nodes } = useVueFlow()

onConnect((params) => {
	addEdges([params])
})

const elements = ref<Elements>([
	{
		id: '1',
		type: 'menu',
		data: { label: 'node 1' },
		position: { x: 250, y: 0 },
		targetPosition: Position.Right,
		sourcePosition: Position.Bottom
	},
	{
		id: '2',
		type: 'resizable',
		data: { label: 'parent node 2' },
		position: { x: 100, y: 100 },
		style: { backgroundColor: 'rgba(16, 185, 129, 0.5)', width: '200px', height: '200px' }
	},
	{
		id: '3',
		type: 'input',
		data: { label: 'child node 3' },
		position: { x: 10, y: 50 },
		parentNode: '2'
	},
	{
		id: '4',
		type: 'resizable',
		data: { label: 'parent node 4' },
		position: { x: 320, y: 175 },
		style: { backgroundColor: 'rgba(16, 185, 129, 0.5)', width: '400px', height: '300px' }
	},
	{
		id: '5',
		type: 'input',
		data: { label: 'child node 5' },
		position: { x: 15, y: 65 },
		extent: 'parent',
		parentNode: '4'
	},
	{
		id: '6',
		type: 'resizable',
		data: { label: 'nested parent node 6' },
		position: { x: 15, y: 120 },
		style: { backgroundColor: 'rgba(139, 92, 246, 0.5)', height: '150px', width: '270px' },
		parentNode: '4'
	},
	{
		id: '7',
		type: 'input',
		data: { label: 'nested child node 7' },
		position: { x: 20, y: 40 },
		parentNode: '6'
	},
	{
		id: '8',
		type: 'input',
		data: { label: 'nested child node 8' },
		position: { x: 100, y: 100 },
		parentNode: '6'
	},
	{
		id: '9',
		type: 'input',
		data: { label: 'child node 9' },
		position: { x: 200, y: 65 },
		parentNode: '4'
	},
	{
		id: '10',
		type: 'input',
		data: { label: 'Drag me to extend area! 10' },
		position: { x: 20, y: 100 },
		class: 'light',
		expandParent: true,
		parentNode: '2'
	},
	{ id: 'e1', source: '1', target: '2' },
	{ id: 'e2', source: '1', target: '4' },
	{ id: 'e3', source: '1', target: '9' },
	{ id: 'e4', source: '3', target: '5' },
	{ id: 'e5', source: '5', target: '7' },
	{ id: 'e6', source: '5', target: '8' },
	{ id: 'e7', source: '7', target: '8' }
])

const addNode = () => {
	addNodes({
		id: `${nodes.value.length + 1}`,
		type: 'menu',
		data: { label: 'new node' },
		position: { x: 0, y: 0 }
	})
}
</script>

<template>
	<div class="h-full w-full flex flex-col">
		<button
			class="w-32 h-12 bg-blue-500 text-white rounded-md"
			@click="addNode"
		>
			Add node
		</button>
		<VueFlow
			v-model="elements"
			fit-view-on-init
			elevate-edges-on-select
		>
			<template #node-resizable="resizableNodeProps">
				<ResizableNode :data="resizableNodeProps.data" />
			</template>

			<template #node-menu="props">
				<ToolbarNode
					:id="props.id"
					:data="props.data"
				/>
			</template>

			<MiniMap />
			<Controls />
			<Background />
		</VueFlow>
	</div>
</template>
