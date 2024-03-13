<script setup lang="ts">
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { customerService, userService } from '@/services'
import { useFormStore } from '@/stores'
import type { IUser } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { MultiSelect } from '@/components/ui/multi-select'
import { toast } from '@/components/ui/toast'

const { id } = defineProps<{
	id: string
}>()

const router = useRouter()
const nameInput = ref<HTMLInputElement | null>(null)
useFocus(nameInput, { initialValue: true })
const selected = ref<Array<{ label: string; value: string }>>([])
const options = ref<Array<{ label: string; value: string }>>([])
const { editCustomer } = useFormStore()
const userIds = editCustomer?.customerUsers?.map(
	(customerUser) => customerUser.userId
) as Array<string>

options.value = (
	(await userService.getAll({ select: ['id', 'lastName', 'firstName'] })) as Array<IUser>
).map((user) => ({
	label: `${user.firstName} ${user.lastName}`,
	value: user.id
}))
selected.value = await Promise.all(
	userIds?.map(async (userId) => {
		const user = await userService.getById(userId, {
			select: ['id', 'lastName', 'firstName']
		})

		return {
			label: `${user.lastName} ${user.firstName}`,
			value: user.id
		}
	})
)

const formSchema = toTypedSchema(
	z.object({
		id: z.string().default(id),
		name: z
			.string({
				required_error: 'Le champ est obligatoire',
				invalid_type_error: 'Le champ est invalide'
			})
			.min(1, { message: 'Le champ est obligatoire' })
			.max(255, { message: 'Le champ doit contenir au maximum 255 caractères' })
			.default(editCustomer?.name ?? ''),
		logo: z.instanceof(File).default(new File([], '')),
		userIds: z
			.array(
				z.object({
					label: z.string(),
					value: z.string()
				}),
				{
					required_error: 'Le champ est obligatoire',
					invalid_type_error: 'Le champ est invalide'
				}
			)
			.default(selected.value)
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		const data = {
			...values,
			logo: values.logo.name
				? `${values.logo.lastModified}_${values.logo.name}`
				: editCustomer!.logo,
			userIds: selected.value.map((userId) => userId.value)
		}

		await customerService.update(id, data)

		router.push('/customers')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: 'Nous ne sommes pas parvenus à modifier ce client.',
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
					v-slot="{ handleChange }"
					name="logo"
				>
					<FormItem class="w-full">
						<FormLabel>Logo</FormLabel>
						<FormControl>
							<Input
								type="file"
								accept="image/png, image/jpeg, image/jpg"
								@change="handleChange"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-slot="{ componentField }"
					name="userIds"
				>
					<FormItem class="w-full relative z-0">
						<FormLabel>Utilisateurs</FormLabel>
						<FormControl>
							<MultiSelect
								v-bind="componentField"
								v-model="selected"
								:options="options"
								:multiple="true"
								placeholder="Sélectionnez des utilisateurs"
								message="Aucun utilisateur trouvé"
								:limit-text="{
									singular: 'utilisateur sélectionné',
									plural: 'utilisateurs sélectionnés'
								}"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div class="flex flex-col-reverse sm:flex-row justify-between">
					<Button
						class="focus-visible:bg-background"
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
</template>
