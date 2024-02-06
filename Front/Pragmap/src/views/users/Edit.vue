<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { userService } from '@/services'
import { useAuthStore } from '@/stores'
import { useUserStore } from '@/stores'
import { Layout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
const { roles } = useAuthStore()
const { editUser, clearEditUser } = useUserStore()
const formSchema = toTypedSchema(
	z.object({
		id: z.string().default(id),
		firstName: z
			.string({ required_error: 'Le champ est obligatoire' })
			.default(editUser?.firstName ?? ''),
		lastName: z
			.string({ required_error: 'Le champ est obligatoire' })
			.default(editUser?.lastName ?? ''),
		email: z
			.string({ required_error: 'Le champ est obligatoire' })
			.email({ message: 'Le champ doit être une adresse e-mail valide' })
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
			description: `Nous ne sommes pas parvenus à créer un utilisateur.`,
			duration: 5000
		})
	}
})
</script>

<template>
	<Layout>
		<Card :class="cn('w-[420px]', $attrs.class ?? '')">
			<CardHeader>
				<CardTitle>Modification d'un utilisateur</CardTitle>
			</CardHeader>
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
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez un rôle" />
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
									<Input v-bind="componentField" />
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
									<Input v-bind="componentField" />
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
									type="email"
									v-bind="componentField"
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
							<Loader2 class="w-4 h-4 mr-2 animate-spin" />
							Modification...
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</Layout>
</template>
