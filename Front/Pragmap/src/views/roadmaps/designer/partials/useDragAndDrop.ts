import { ref, type Ref, watch } from 'vue'
import { type Elements, Position, useVueFlow } from '@vue-flow/core'
import { format } from 'date-fns'

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
		//Find the highest node id
		console.log(elements.value.map((node) => parseInt(node.id)))
		const nodeId = (
			elements.value.length > 0
				? Math.max(
						...elements.value
							.filter((node) => node.type !== 'default') // Filtrer les nœuds de type 'default'
							.map((node) => parseInt(node.id))
					) + 1
				: 1
		).toString()
		console.log(nodeId)
		const label =
			draggedType.value === 'task'
				? 'Tâche'
				: draggedType.value === 'deliverable'
					? 'Livrable'
					: draggedType.value === 'milestone'
						? 'Jalon'
						: draggedType.value === 'group'
							? 'Groupe'
							: 'Bloc'
		const defaultNode = {
			id: nodeId,
			type: draggedType.value ?? 'node',
			label: label,
			position: position,
			sourcePosition: Position.Left,
			parentNode: ''
		}
		const groupNode = {
			...defaultNode,
			data: {
				description: `Description de ` + label,
				type: 'group',
				startDate: format(new Date(), 'yyyy-MM-dd'),
				endDate: format(new Date(), 'yyyy-MM-dd')
			},
			style: { backgroundColor: 'rgba(0, 255, 0, 0.1)', width: '700px', height: '400px' },
			type: 'resizable',
			targetPosition: Position.Left,
			sourcePosition: Position.Right
		}
		const taskNode = {
			...defaultNode,
			data: {
				description: `Description de ` + label,
				duration: 0,
				progress: 0,
				class: 'vue-flow__node-input',
				startDate: format(new Date(), 'yyyy-MM-dd'),
				endDate: format(new Date(), 'yyyy-MM-dd')
			},
			targetPosition: Position.Right
		}
		const deliverableNode = {
			...defaultNode,
			data: {
				description: `Description de ` + label,
				duration: 0,
				progress: 0,
				startDate: format(new Date(), 'yyyy-MM-dd'),
				endDate: format(new Date(), 'yyyy-MM-dd'),
				file: ''
			},
			targetPosition: Position.Left
		}
		const milestoneNode = {
			...defaultNode,
			data: {
				description: `Description de ` + label,
				startDate: format(new Date(), 'yyyy-MM-dd'),
				endDate: format(new Date(), 'yyyy-MM-dd')
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
					: draggedType.value === 'group'
						? groupNode
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
