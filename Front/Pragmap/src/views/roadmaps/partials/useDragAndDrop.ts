import { Position, useVueFlow, type Element, type Node } from '@vue-flow/core'
import { ref, watch, type Ref } from 'vue'

const state = {
  draggedType: ref<string | null>(null),
  isDragOver: ref<boolean>(false),
  isDragging: ref<boolean>(false),
}

export default function useDragAndDrop(elements: Ref<Element[]>) {
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
      y: event.clientY,
    })
    const nodeId = (elements.value.length + 1).toString()
    const label = draggedType.value === 'task'
      ? 'Tâche' : draggedType.value === 'deliverable'
        ? 'Livrable' : draggedType.value === 'milestone'
          ? 'Jalon' : 'Bloc'
    const node = {
      id: nodeId,
      type: draggedType.value ?? 'node',
      position: position,
      label: label,
      data: {
        name: label,
        description: `Description de ` + label,
        duration: 0,
        start: false
      },
    }
    const defaultNode = {
      ...node,
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    }
    const deliverableNode = {
      ...node,
      targetPosition: Position.Top,
    }
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 },
      }))

      off()
    })
    const newNode: Node<any, any, string> = draggedType.value === 'deliverable' ? deliverableNode : defaultNode

    addNodes(newNode)
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
}
