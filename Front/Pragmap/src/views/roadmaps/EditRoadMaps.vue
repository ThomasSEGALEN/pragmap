<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { roadMapService, customerService } from '@/services'
import { useRoadMapStore } from '@/stores'
import { Layout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Loader2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'
import type { IGetCustomer } from '@/types'
import { onMounted, ref } from 'vue'

const { id } = defineProps<{
	id: string
}>()
const customers = ref<Array<IGetCustomer>>([])
onMounted(async () => {
	customers.value = await customerService.getAll()
})
const { editRoadMap, clearEditRoadMap } = useRoadMapStore()
console.log(editRoadMap);

const formSchema = toTypedSchema(
	z
		.object({
			id: z.string().default(id),
			name: z.string({ required_error: 'Le champ est obligatoire' })
			.default(editRoadMap?.name ?? ''),
			customerId: z.string({ required_error: 'Le champ est obligatoire' })
			.default(editRoadMap?.customerId ?? ''),
		})
)

const { handleSubmit, isSubmitting } = useForm({	
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	console.log(values);
	try {
		await roadMapService.update(id, values)

		clearEditRoadMap()

		router.push('/roadmaps')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `Nous ne sommes pas parvenus à modifier la roadmap.`,
			duration: 5000
		})
	}
})
</script>

<template>
	<Layout>
		<template #header>
			<h1>Modification d'une RoadMap</h1>
		</template>
		<Card :class="cn('w-[420px] pt-6', $attrs.class ?? '')">
			<CardContent>
				<form
					class="space-y-6"
					@submit="onSubmit"
				>
						<FormField
							v-slot="{ componentField }"
							name="name"
						>
							<FormItem class="w-full">
								<FormLabel>Nom</FormLabel>
								<FormControl>
									<Input v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
						<FormField
							v-slot="{ componentField }"
							name="customerId"
						>
						<FormItem>
							<FormLabel>Client</FormLabel>
							<FormControl>
								<Select v-bind="componentField">
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez un client" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Client</SelectLabel>
											<SelectItem
												v-for="customer in customers"
												:key="customer.id"
												:value="customer.id"
											>
												{{ customer.name }}
											</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<div class="flex flex-col-reverse md:flex-row justify-between">
						<Button
							type="button"
							variant="link"
							size="sm"
							as-child
						>
							<RouterLink to="/roadmaps">&#x2190; Retour</RouterLink>
						</Button>
						<Button
							v-if="!isSubmitting"
							type="submit"
						>
							Modifier
						</Button>
						<Button
							v-else
							type="disabled"
						>
							<Loader2 class="h-4 w-4 mr-2 animate-spin" />
							Modification...
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</Layout>
</template>
