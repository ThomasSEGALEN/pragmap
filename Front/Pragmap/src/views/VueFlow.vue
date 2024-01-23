<script lang="ts" setup>
import type { Elements, Node, SnapGrid, Styles } from '@vue-flow/core'
import { MarkerType, VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { ref } from 'vue'

useVueFlow()
const initialElements: Elements = [
  {
    id: '1',
    type: 'input',
    label: 'Welcome to <strong>Vue VueFlow!</strong>',
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    label: 'This is a <strong>default node</strong>',
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    label: 'This one has a <strong>custom style</strong>',
    position: { x: 400, y: 100 },
    style: { background: '#D6D5E6', color: '#333', border: '1px solid #222138', width: 180 },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    label: `You can find the docs on
          <a href="https://github.com/bcakmakoglu/vue-flow" target="_blank" rel="noopener noreferrer">
            Github
          </a>`,
  },
  {
    id: '5',
    label: 'Or check out the other <strong>examples</strong>',
    position: { x: 250, y: 325 },
  },
  {
    id: '6',
    type: 'output',
    label: 'An <strong>output node</strong>',
    position: { x: 100, y: 480 },
  },
  { id: '7', type: 'output', label: 'Another output node', position: { x: 400, y: 450 } },
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e3-4', source: '3', target: '4', animated: true, label: 'animated edge' },
  { id: 'e4-5', source: '4', target: '5', markerEnd: { type: MarkerType.ArrowClosed }, label: 'edge with arrowhead' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', label: 'smooth step edge' },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'step',
    style: { stroke: '#f6ab6c' },
    label: 'a step edge',
    animated: true,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
]
const elements = ref<Elements>(initialElements)
const snapGrid: SnapGrid = [16, 16]
function nodeStrokeColor(n: Node): string {
  if ((n.style as Styles)?.background) {
    return (n.style as Styles).background as string
  }
  if (n.type === 'input') {
    return '#0041d0'
  }
  if (n.type === 'output') {
    return '#ff0072'
  }
  if (n.type === 'default') {
    return '#1a192b'
  }

  return '#eee'
}
function nodeColor(n: Node): string {
  if ((n.style as Styles)?.background) {
    return (n.style as Styles).background as string
  }

  return '#fff'
}
const { nodesSelectionActive, addSelectedNodes, getNodes, viewport } = useVueFlow()
function selectAll() {
  addSelectedNodes(getNodes.value)
  nodesSelectionActive.value = true
}
let id = 0
function getId() {
  return `dndnode_${id++}`
}

const { onConnect, addEdges, addNodes, project } = useVueFlow({
  nodes: [
    {
      id: '1',
      type: 'input',
      label: 'input node',
      position: { x: 250, y: 5 },
    },
  ],
})
function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const wrapper = ref()

onConnect(addEdges)

function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('application/vueflow')

  const flowbounds = wrapper.value.$el.getBoundingClientRect()

  const position = project({
    x: event.clientX - flowbounds.left,
    y: event.clientY - flowbounds.top,
  })

  addNodes({
    id: getId(),
    type,
    position,
    label: `${type} node`,
  })
}
function onDragStart(event: DragEvent, nodeType: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
	<div class="providerflow">
		<aside>
			<div class="description">
				This is an example of how you can access the internal state outside of the Vue VueFlow component.
			</div>
			<div class="title">Zoom & pan transform</div>
			<div class="transform">
				{{ [viewport.x.toFixed(2), viewport.y.toFixed(2), viewport.zoom.toFixed(2)] }}
			</div>
			<div class="title">Nodes</div>
			<div v-for="node of getNodes" :key="node.id">
				Node {{ node.id }} - x: {{ node.position.x.toFixed(2) }}, y: {{ node.position.y.toFixed(2) }}
			</div>

			<div class="selectall">
				<button @click="selectAll">select all nodes</button>
			</div>
			<div class="description">You can drag these nodes to the pane on the left.</div>
			<div class="vue-flow__node-input" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'input')">
				Input Node
			</div>
			<div class="vue-flow__node-default" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'default')">
				Default Node
			</div>
			<div class="vue-flow__node-output" :draggable="true" @dragstart="(event: DragEvent) => onDragStart(event, 'output')">
				Output Node
			</div>
		</aside>
	  <div class="vue-flow-wrapper dndflow" @drop="onDrop">
			<VueFlow
				v-model="elements"
				:connection-line-style="{ stroke: '#ddd' }"
				snap-to-grid
				:snap-grid="snapGrid"
				ref="wrapper"
				@dragover="onDragOver"
			>
				<MiniMap :node-stroke-color="nodeStrokeColor" :node-color="nodeColor" :node-border-radius="2" />
				<Controls />
				<Background color="#aaa" :gap="20" />
			</VueFlow>
		</div>
	</div>
</template>

<style scoped>
.dndflow {
  flex-direction: column;
  display: flex;
  height: 100%;
}

.dndflow aside {
  border-right: 1px solid #eee;
  padding: 15px 10px;
  font-size: 12px;
  background: #fcfcfc;
}

.dndflow aside > * {
  margin-bottom: 10px;
  cursor: grab;
}

.dndflow aside .description {
  margin-bottom: 10px;
}

.dndflow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%;
}

@media screen and (min-width: 768px) {
  .dndflow {
    flex-direction: row;
  }

  .dndflow aside {
    width: 20%;
    max-width: 180px;
  }
}
.providerflow {
  flex-direction: column;
  display: flex;
  height: 100%;
}

.providerflow aside {
  border-right: 1px solid #eee;
  padding: 15px 10px;
  font-size: 12px;
  background: #fcfcfc;
}

.providerflow aside .description {
  margin-bottom: 10px;
}

.providerflow aside .title {
  font-weight: 700;
  margin-bottom: 5px;
}

.providerflow aside .transform {
  margin-bottom: 20px;
}

.providerflow .vue-flow-wrapper {
  flex-grow: 1;
  height: 100%;
}

.providerflow .selectall {
  margin-top: 10px;
}

@media screen and (min-width: 768px) {
  .providerflow {
    flex-direction: row;
  }

  .providerflow aside {
    width: 20%;
    max-width: 250px;
  }
}
</style>
```