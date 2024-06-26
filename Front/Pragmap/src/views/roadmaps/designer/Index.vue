<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
	type Elements,
	type GraphNode,
	type NodeDragEvent,
	useVueFlow,
	VueFlow
} from '@vue-flow/core'
import { MiniMap, Background } from '@vue-flow/additional-components'
import { convertToBase64, z } from '@/lib/utils'
import { roadmapService } from '@/services'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import useDragAndDrop from './partials/useDragAndDrop'
import ResizableNode from './partials/resizableNode.vue'

const { id } = useRoute().params as { id: string }
const nameInput = ref<HTMLInputElement | null>(null)
useFocus(nameInput, { initialValue: true })
const elements = ref<Elements>([])
const selectedNodeId = ref(null)
const selectedNode = computed(() => elements.value.find((node) => node.id === selectedNodeId.value))
const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, isDragOver, onDragStart } = useDragAndDrop(elements)
onConnect((params) => {
	addEdges([params])
})
const data = (await roadmapService.getById(id)).data
elements.value = JSON.parse(data) ?? []
const saveData = async () => {
	const data = {
		id: id,
		data: JSON.stringify(elements.value)
	}

	await roadmapService.update(data.id, data)
}
const formSchema = toTypedSchema(
	z.object({
		name: z.string().trim().min(1, { message: 'Obligatoire' }).max(255),
		description: z.string().trim().min(1, { message: 'Obligatoire' }).max(255),
		startDate: z.coerce.date(),
		endDate: z.coerce.date(),
		duration: z.coerce
			.number()
			.min(0)
			.refine((value) => value >= 0),
		progress: z.coerce.number().min(0).max(100),
		file: z.instanceof(File).default(new File([], ''))
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		if (values.file.size > 0) {
			selectedNode.value!.data['file'] = await convertToBase64(values.file)
		}

		await saveData()
	} catch (error) {
		toast({
			title: 'Erreur',
			description: 'Nous ne sommes pas parvenus à modifier cette roadmap.',
			duration: 5000
		})
	}
})

// Helper function to determine if the node is inside a group node
const isNodeInsideGroup = (node: GraphNode, groupNode: GraphNode) => {
	const nodeX = node.computedPosition.x
	const nodeY = node.computedPosition.y
	const nodeWidth = node.dimensions.width
	const nodeHeight = node.dimensions.height
	const groupNodeX = groupNode.computedPosition.x
	const groupNodeY = groupNode.computedPosition.y
	const groupNodeWidth = groupNode.dimensions.width
	const groupNodeHeight = groupNode.dimensions.height
	return (
		nodeX > groupNodeX &&
		nodeY > groupNodeY &&
		nodeX + nodeWidth < groupNodeX + groupNodeWidth &&
		nodeY + nodeHeight < groupNodeY + groupNodeHeight
	)
}
const { screenToFlowCoordinate } = useVueFlow()

const handleNodeDragStop = (event: NodeDragEvent) => {
	console.log((event.event as MouseEvent).clientX)
	const node = elements.value.find((el) => el.id === event.node.id) as GraphNode
	const nodeWidth = node.dimensions.width
	const nodeHeight = node.dimensions.height

	let parentNodeId = ''
	elements.value.forEach((el) => {
		if (el.data.type === 'group' && isNodeInsideGroup(node, el as GraphNode)) {
			parentNodeId = el.id
		}
	})

	const newNodePosition = screenToFlowCoordinate({
		x: (event.event as MouseEvent).clientX,
		y: (event.event as MouseEvent).clientY
	})

	if (parentNodeId != '') {
		const parentNode = elements.value.find((el) => el.id === parentNodeId)

		// Adjust the node's position relative to the parent node
		node.position = {
			x: newNodePosition.x - (parentNode as GraphNode).computedPosition.x - nodeWidth / 2,
			y: newNodePosition.y - (parentNode as GraphNode).computedPosition.y - nodeHeight / 2
		}

		node.parentNode = parentNodeId
	} else {
		// If no parent node, the position is relative to the viewport
		node.position = {
			x: newNodePosition.x - nodeWidth / 2,
			y: newNodePosition.y - nodeHeight / 2
		}

		node.parentNode = ''
	}
	console.log(elements.value)
	saveData()
}
</script>
<style scoped>
@import './node.css';
</style>
<template>
	<div
		class="w-full relative flex flex-col"
		@drop="onDrop($event)"
	>
		<div class="flex justify-between border-x border-t bg-primary-foreground">
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
					<div
						class="vue-flow__node-default vue-flow__node-parent"
						:draggable="true"
						@dragstart="onDragStart($event, 'group')"
					>
						Groupe
					</div>
				</div>
			</aside>
		</div>
		<VueFlow
			class="border"
			v-model="elements"
			fit-view-on-init
			@dragover="onDragOver($event as DragEvent)"
			@dragleave="onDragLeave"
			@node-click="
				(e: any) =>
					selectedNodeId === e.node.id ? (selectedNodeId = null) : (selectedNodeId = e.node.id)
			"
			@pane-click="selectedNodeId ? (selectedNodeId = null) : null"
			@node-drag-stop="handleNodeDragStop"
		>
			<Background
				:size="1"
				:gap="25"
				pattern-color="#BDBDBD"
				:style="{
					backgroundColor: isDragOver ? '#FAFAFA' : 'transparent',
					transition: 'background-color 0.2s ease'
				}"
			>
				<slot />
			</Background>
			<template #node-resizable="resizableNodeProps">
				<ResizableNode :data="resizableNodeProps" />
			</template>
			<MiniMap />
		</VueFlow>
		<div
			v-if="selectedNodeId && selectedNode"
			class="h-full w-[20rem] absolute top-0 right-0 flex flex-col justify-start space-y-2 p-4 py-12 border bg-primary-foreground"
		>
			<form
				class="px-2 space-y-6 overflow-auto"
				@submit="onSubmit"
			>
				<FormField
					v-slot="{ componentField }"
					v-model="selectedNode.label"
					name="name"
				>
					<FormItem class="w-full">
						<FormLabel>Nom</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								ref="nameInput"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-slot="{ componentField }"
					v-model="selectedNode.data['description']"
					name="description"
				>
					<FormItem class="w-full">
						<FormLabel>Description</FormLabel>
						<FormControl>
							<Textarea v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-if="selectedNode.type !== 'milestone'"
					v-slot="{ componentField }"
					v-model="selectedNode.data['progress']"
					name="progress"
				>
					<FormItem class="w-full">
						<FormLabel>Progression</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								type="number"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-slot="{ componentField }"
					v-model="selectedNode.data['startDate']"
					name="startDate"
				>
					<FormItem class="w-full">
						<FormLabel>Date de début</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								type="date"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-slot="{ componentField }"
					v-model="selectedNode.data['endDate']"
					name="endDate"
				>
					<FormItem class="w-full">
						<FormLabel>Date de fin</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								type="date"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-if="selectedNode.type === 'deliverable'"
					v-slot="{ handleChange }"
					name="file"
				>
					<FormItem class="w-full">
						<FormLabel>Fichier</FormLabel>
						<FormControl>
							<Input
								type="file"
								accept="image/png, image/jpeg, image/jpg, .pdf"
								@change="handleChange"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div class="flex justify-between">
					<Button
						type="button"
						variant="destructive"
						@click="
							() => {
								elements.splice(
									elements.findIndex((node) => node.id === selectedNodeId),
									1
								)

								selectedNodeId = null

								saveData()
							}
						"
					>
						Supprimer
					</Button>
					<Button
						v-if="!isSubmitting"
						type="submit"
					>
						Modifier
					</Button>
					<Button
						v-else
						disabled
					>
						<Loader2 class="h-4 w-4 mr-2 animate-spin" />
						Modification...
					</Button>
				</div>
			</form>
		</div>
	</div>
</template>
