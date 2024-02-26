<script setup lang="ts">
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { userService } from '@/services'
import { useAuthStore, useUserStore } from '@/stores'
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

const { id } = defineProps<{
	id: string
}>()

const router = useRouter()
const { roles } = useAuthStore()
const roleInput = ref<HTMLInputElement | null>(null)
useFocus(roleInput, { initialValue: true })
const { editUser, clearEditUser } = useUserStore()
const formSchema = toTypedSchema(
	z.object({
		id: z.string().default(id),
		firstName: z
			.string({
				required_error: 'Le champ est obligatoire',
				invalid_type_error: 'Le champ est invalide'
			})
			.min(1, { message: 'Le champ est obligatoire' })
			.max(255, { message: 'Le champ doit contenir au maximum 255 caractères' })
			.default(editUser?.firstName ?? ''),
		lastName: z
			.string({
				required_error: 'Le champ est obligatoire',
				invalid_type_error: 'Le champ est invalide'
			})
			.min(1, { message: 'Le champ est obligatoire' })
			.max(255, { message: 'Le champ doit contenir au maximum 255 caractères' })
			.default(editUser?.lastName ?? ''),
		email: z
			.string({
				required_error: 'Le champ est obligatoire',
				invalid_type_error: 'Le champ est invalide'
			})
			.min(1, { message: 'Le champ est obligatoire' })
			.email({ message: 'Le champ doit être une adresse e-mail valide' })
			.max(254, { message: 'Le champ doit contenir au maximum 254 caractères' })
			.default(editUser?.email ?? ''),
		roleId: z.string({ required_error: 'Le champ est obligatoire' }).default(editUser?.roleId ?? '')
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		await userService.update(id, values)

		clearEditUser()

		router.push('/users')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `Nous ne sommes pas parvenus à modifier cet utilisateur.`,
			duration: 5000
		})
	}
})
</script>

<template>
	<Card :class="cn('w-[420px] pt-6', $attrs.class ?? '')">
		<CardContent>
			<form
				class="space-y-6"
				@submit="onSubmit"
			>
				<FormField
					v-slot="{ componentField }"
					name="roleId"
				>
					<FormItem>
						<FormLabel>Rôle</FormLabel>
						<FormControl>
							<Select v-bind="componentField">
								<SelectTrigger ref="roleInput">
									<SelectValue placeholder="Sélectionner un rôle" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Rôles</SelectLabel>
										<SelectItem
											v-for="role in roles"
											:key="role.id"
											:value="role.id"
										>
											{{ role.name }}
										</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div class="flex flex-row justify-between space-x-4">
					<FormField
						v-slot="{ componentField }"
						name="lastName"
					>
						<FormItem class="w-full">
							<FormLabel>Nom</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									autocomplete="family-name"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField
						v-slot="{ componentField }"
						name="firstName"
					>
						<FormItem class="w-full">
							<FormLabel>Prénom</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									autocomplete="given-name"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</div>
				<FormField
					v-slot="{ componentField }"
					name="email"
				>
					<FormItem>
						<FormLabel>Adresse e-mail</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								type="email"
								autocomplete="email"
							/>
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
						<RouterLink to="/users">&#x2190; Retour</RouterLink>
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
