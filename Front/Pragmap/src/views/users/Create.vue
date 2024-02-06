<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { userService } from '@/services'
import { useAuthStore } from '@/stores'
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

const { roles } = useAuthStore()
const formSchema = toTypedSchema(
	z
		.object({
			firstName: z.string({ required_error: 'Le champ est obligatoire' }),
			lastName: z.string({ required_error: 'Le champ est obligatoire' }),
			email: z
				.string({ required_error: 'Le champ est obligatoire' })
				.email({ message: 'Le champ doit être une adresse e-mail valide' }),
			password: z
				.string({ required_error: 'Le champ est obligatoire' })
				.min(6, { message: 'Le champ doit contenir au minimum 6 caractères' }),
			passwordConfirmation: z
				.string({ required_error: 'Le champ est obligatoire' })
				.min(6, { message: 'Le champ doit contenir au minimum 6 caractères' }),
			roleId: z.string({ required_error: 'Le champ est obligatoire' })
		})
		.superRefine((value, context) => {
			if (value.password !== value.passwordConfirmation) {
				return context.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Les mots de passe ne correspondent pas',
					path: ['passwordConfirmation']
				})
			}
		})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		userService.create(values)

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
				<CardTitle>Création d'un utilisateur</CardTitle>
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
					<FormField
						v-slot="{ componentField }"
						name="password"
					>
						<FormItem>
							<FormLabel>Mot de passe</FormLabel>
							<FormControl>
								<Input
									type="password"
									v-bind="componentField"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField
						v-slot="{ componentField }"
						name="passwordConfirmation"
					>
						<FormItem>
							<FormLabel>Confirmation du mot de passe</FormLabel>
							<FormControl>
								<Input
									type="password"
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
