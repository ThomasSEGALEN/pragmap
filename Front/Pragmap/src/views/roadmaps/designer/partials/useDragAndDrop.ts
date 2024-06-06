import { ref, type Ref, watch } from 'vue'
import { type Elements, Position, useVueFlow } from '@vue-flow/core'

const state = {
	draggedType: ref<string | null>(null),
	isDragOver: ref<boolean>(false),
	isDragging: ref<boolean>(false)
}

export default function useDragAndDrop(elements: Ref<Elements>) {
	const { draggedType, isDragOver, isDragging } = state
	const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } = useVueFlow()

	watch(isDragging, (dragging) => {
		document.body.style.userSelect = dragging ? 'none' : ''
	})

	const onDragStart = (event: DragEvent, type: string) => {
		if (event.dataTransfer) {
			event.dataTransfer.setData('application/vueflow', type)
			event.dataTransfer.effectAllowed = 'move'
		}

		draggedType.value = type
		isDragging.value = true

		document.addEventListener('drop', onDragEnd)
	}
	const onDragOver = (event: DragEvent) => {
		event.preventDefault()

		if (draggedType.value) {
			isDragOver.value = true

			if (event.dataTransfer) {
				event.dataTransfer.dropEffect = 'move'
			}
		}
	}
	const onDragLeave = () => {
		isDragOver.value = false
	}
	const onDragEnd = () => {
		isDragging.value = false
		isDragOver.value = false
		draggedType.value = null
		document.removeEventListener('drop', onDragEnd)
	}
	const onDrop = (event: DragEvent) => {
		const position = screenToFlowCoordinate({
			x: event.clientX,
			y: event.clientY
		})
		const nodeId = (elements.value.length + 1).toString()
		const label =
			draggedType.value === 'task'
				? 'Tâche'
				: draggedType.value === 'deliverable'
					? 'Livrable'
					: draggedType.value === 'milestone'
						? 'Jalon'
						: 'Bloc'
		const defaultNode = {
			id: nodeId,
			type: draggedType.value ?? 'node',
			position: position,
			label: label,
			sourcePosition: Position.Left
		}
		const taskNode = {
			...defaultNode,
			data: {
				description: `Description de ` + label,
				duration: 0,
				progress: 0,
				startDate: new Date().toISOString(),
				endDate: new Date().toISOString()
			},
			targetPosition: Position.Right
		}
		const deliverableNode = {
			...defaultNode,
			data: {
				description: `Description de ` + label,
				duration: 0,
				progress: 0,
				file: ''
			},
			targetPosition: Position.Left
		}
		const milestoneNode = {
			...defaultNode,
			data: {
				description: `Description de ` + label
			},
			targetPosition: Position.Left
		}
		const { off } = onNodesInitialized(() => {
			updateNode(nodeId, (node) => ({
				position: {
					x: node.position.x - node.dimensions.width / 2,
					y: node.position.y - node.dimensions.height / 2
				}
			}))

			off()
		})
		const newNode =
			draggedType.value === 'task'
				? taskNode
				: draggedType.value === 'deliverable'
					? deliverableNode
					: milestoneNode

		addNodes(newNode)
	}

	return {
		draggedType,
		isDragOver,
		isDragging,
		onDragStart,
		onDragLeave,
		onDragOver,
		onDrop
	}
}
