<script setup lang="ts" generic="TData">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from '@/lib/utils'
import { roadmapService } from '@/services'
import { useTableStore } from '@/stores'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

const { entities, entityId, entityData, entityType } = defineProps<{
	entities: Array<TData>
	entityId: string
	entityData: string
	entityType?: string
}>()

const { id } = useRoute().params as { id: string }
const router = useRouter()
const roadmapData = useTableStore().getData()
const input = ref<HTMLInputElement | null>(null)
useFocus(input, { initialValue: true })
const formSchema = toTypedSchema(
	z.object({
		input: z
			.string()
			.trim()
			.min(1, { message: 'Obligatoire' })
			.max(254)
			.transform((value) => {
				if (entityType === 'number') return parseInt(value)
				return value
			})
	})
)
const { handleSubmit } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	const newEntity = entities.find((item) => (item as { id: string }).id === entityId)
	const update: { key: string; value: string | number } = {
		key: entityData === 'label' ? 'label' : `data.${entityData}`,
		value: values.input
	}
	const keys = update.key.split('.')
	const finalKey = keys.pop() as string
	const node = keys.reduce((node, key) => node[key], newEntity as { [key: string]: any })
	node[finalKey] = update.value
	const newData = roadmapData.map((obj: any) => (obj.id === entityId ? newEntity : obj))

	try {
		roadmapService.update(id, { id: id, data: JSON.stringify(newData) }).then(() => router.go(0))
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `${values.input}`,
			duration: 5000
		})
	}
})
</script>

<template>
	<AlertDialog>
		<AlertDialogTrigger as-child>
			<Button
				class="px-2 focus-visible:ring-offset-0"
				variant="link"
			>
				<slot />
			</Button>
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Modification des données : {{ entityData }}</AlertDialogTitle>
				<AlertDialogDescription>
					<form
						class="space-y-6"
						@submit="(event) => event.preventDefault()"
					>
						<FormField
							v-slot="{ componentField }"
							name="input"
						>
							<FormItem>
								<FormLabel>{{ entityData }}</FormLabel>
								<FormControl>
									<Input
										v-bind="componentField"
										ref="input"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</form>
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Annuler</AlertDialogCancel>
				<AlertDialogAction @click="onSubmit">Continuer</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>
