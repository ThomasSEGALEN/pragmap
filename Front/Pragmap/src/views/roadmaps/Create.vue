<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { customerService, roadmapService } from '@/services'
import type { ICustomer } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { MultiSelect } from '@/components/ui/multi-select'
import { toast } from '@/components/ui/toast'

const router = useRouter()
const nameInput = ref<HTMLInputElement | null>(null)
useFocus(nameInput, { initialValue: true })
const selected = ref<Record<'label' | 'value', string>>()
const options = ref<Array<Record<'label' | 'value', string>>>([])

options.value = (
	(await customerService.getAll({ select: ['id', 'name'] })) as Array<ICustomer>
).map((customer) => ({
	label: customer.name,
	value: customer.id
}))

const customers = ref<Array<ICustomer>>([])
onMounted(async () => {
	customers.value = (await customerService.getAll()) as Array<ICustomer>
})
const formSchema = toTypedSchema(
	z.object({
		name: z
			.string({
				required_error: 'Le champ est obligatoire',
				invalid_type_error: 'Le champ est invalide'
			})
			.min(1, { message: 'Le champ est obligatoire' })
			.max(255, { message: 'Le champ doit contenir au maximum 255 caractères' }),
		customerId: z
			.object(
				{
					label: z.string(),
					value: z.string()
				},
				{
					required_error: 'Le champ est obligatoire',
					invalid_type_error: 'Le champ est invalide'
				}
			)
			.superRefine((value, context) => {
				if (!value?.value) {
					return context.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Le champ est obligatoire',
						path: ['customerId']
					})
				}
			})
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		const data = {
			name: values.name,
			customerId: values.customerId.value
		}

		await roadmapService.create(data)

		router.push('/roadmaps')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `Nous ne sommes pas parvenus à créer la roadmap.`,
			duration: 5000
		})
	}
})
</script>

<template>
	<Card :class="cn('h-fit w-[420px] pt-6', $attrs.class ?? '')">
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
							<Input
								v-bind="componentField"
								ref="nameInput"
								autocomplete="organization"
							/>
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
							<MultiSelect
								v-bind="componentField"
								v-model="selected"
								:options="options"
								:multiple="false"
								placeholder="Sélectionnez un client"
								message="Aucun client trouvé"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div class="flex flex-col-reverse md:flex-row justify-between">
					<Button
						class="focus-visible:bg-background"
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
						Créer
					</Button>
					<Button
						v-else
						type="disabled"
					>
						<Loader2 class="h-4 w-4 mr-2 animate-spin" />
						Création...
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</template>