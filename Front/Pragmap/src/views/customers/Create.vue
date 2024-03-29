<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { cn, z } from '@/lib/utils'
import { customerService, userService } from '@/services'
import type { IUser } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { MultiSelect } from '@/components/ui/multi-select'
import { toast } from '@/components/ui/toast'
import { convertLogoToBase64 } from './partials/convertLogo'

const router = useRouter()
const nameInput = ref<HTMLInputElement | null>(null)
useFocus(nameInput, { initialValue: true })
const selected = ref<Array<Record<'label' | 'value', string>>>([])
const options = ref<Array<Record<'label' | 'value', string>>>([])

options.value = (
	(await userService.getAll({ select: ['id', 'lastName', 'firstName'] })) as Array<IUser>
).map((user) => ({
	label: `${user.firstName} ${user.lastName}`,
	value: user.id
}))

const formSchema = toTypedSchema(
	z.object({
		name: z.string().trim().min(1, { message: 'Obligatoire' }).max(255),
		logo: z.custom<File>().superRefine((value, context) => {
			if (!value?.name) {
				return context.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Obligatoire',
					path: ['logo']
				})
			}
		}),
		userIds: z
			.array(
				z.object({
					label: z.string(),
					value: z.string()
				})
			)
			.default([])
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		const data = {
			name: values.name,
			logo: await convertLogoToBase64(values.logo),
			userIds: values.userIds.map((userId) => userId.value)
		}

		await customerService.create(data)

		router.push('/customers')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: 'Nous ne sommes pas parvenus à créer un client.',
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
