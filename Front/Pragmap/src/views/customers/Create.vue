<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Layout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'
import { customerService, userService } from '@/services'
import { onMounted, ref } from 'vue'
import { MultiSelect } from '@/components/ui/multi-select'

const formSchema = toTypedSchema(
	z.object({
		name: z.string({ required_error: 'Le champ est obligatoire' }),
		logo: z.instanceof(File).optional(),
		userIds: z
			.array(
				z.object({
					label: z.string(),
					value: z.string()
				})
			)
			.optional()
			.superRefine((value, context) => {
				if (value === undefined || value.length === 0) {
					return context.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Le champ est obligatoire',
						path: ['userIds']
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
		await customerService.create({
			...values,
			logo: `${file.value?.lastModified}_${file.value?.name}`,
			userIds: values.userIds!.map((userId) => userId.value)
		})

		router.push('/customers')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `Nous ne sommes pas parvenus à créer un client.`,
			duration: 5000
		})
	}
})

const options = ref<Array<Record<'value' | 'label', string>>>([])
onMounted(async () => {
	options.value = (await userService.getAll({ select: ['id', 'lastName', 'firstName'] })).map(
		(user) => ({
			value: user.id,
			label: `${user.firstName} ${user.lastName}`
		})
	)
})
const selected = ref<Array<Record<'label' | 'value', string>> | Array<string>>([])
const file = ref<File>()
</script>

<template>
	<Layout>
		<template #header>
			<h1>Création d'un client</h1>
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
					<FormField name="logo">
						<FormItem class="w-full">
							<FormLabel>Logo</FormLabel>
							<FormControl>
								<Input
									type="file"
									accept="image/*"
									@change="(e: Event) => (file = (e.target as HTMLInputElement).files![0])"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField
						v-slot="{ componentField }"
						name="userIds"
					>
						<FormItem class="w-full">
							<FormLabel>Utilisateurs</FormLabel>
							<FormControl>
								<MultiSelect
									v-bind="componentField"
									v-model="selected"
									:options="options"
									placeholder="Sélectionner des utilisateurs"
									:limit-text="{
										singular: 'utilisateur sélectionné',
										plural: 'utilisateur(s) sélectionné(s)'
									}"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>

					<div class="flex flex-col-reverse sm:flex-row justify-between">
						<Button
							type="button"
							variant="link"
							size="sm"
							as-child
						>
							<RouterLink to="/customers">&#x2190; Retour</RouterLink>
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
							<Loader2 class="w-4 h-4 mr-2 animate-spin" />
							Création...
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</Layout>
</template>
