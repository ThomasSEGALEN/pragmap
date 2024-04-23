<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { cn, z } from '@/lib/utils'
import { userService } from '@/services'
import { useAuthStore } from '@/stores'
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

const router = useRouter()
const { roles } = useAuthStore()
const roleInput = ref<HTMLInputElement | null>(null)
useFocus(roleInput, { initialValue: true })
const formSchema = toTypedSchema(
	z
		.object({
			firstName: z.string().trim().min(1, { message: 'Obligatoire' }).max(255),
			lastName: z.string().trim().min(1, { message: 'Obligatoire' }).max(255),
			email: z.string().min(1, { message: 'Obligatoire' }).max(254).email(),
			password: z
				.string()
				.trim()
				.min(1, { message: 'Obligatoire' })
				.regex(/.*[a-z]/, { message: 'Le champ doit contenir au moins une minuscule' })
				.regex(/.*[A-Z]/, { message: 'Le champ doit contenir au moins une majuscule' })
				.regex(/.*\d/, { message: 'Le champ doit contenir au moins un chiffre' })
				.regex(/.*[@$!%*?&]/, { message: 'Le champ doit contenir au moins un caractère spécial' })
				.min(8)
				.max(255),
			passwordConfirmation: z.string().trim().min(1, { message: 'Obligatoire' }).max(255),
			roleId: z.string()
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
		await userService.create(values)

		router.push('/users')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: 'Nous ne sommes pas parvenus à créer un utilisateur.',
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
					name="roleId"
				>
					<FormItem>
						<FormLabel>Rôle</FormLabel>
						<FormControl>
							<Select v-bind="componentField">
								<SelectTrigger ref="roleInput">
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
				<FormField
					v-slot="{ componentField }"
					name="password"
				>
					<FormItem>
						<FormLabel>Mot de passe</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								type="password"
								autocomplete="new-password"
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
								v-bind="componentField"
								type="password"
								autocomplete="new-password"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div class="flex flex-col-reverse md:flex-row justify-between">
					<Button
						class="bg-background"
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
						<Loader2 class="h-4 w-4 mr-2 animate-spin" />
						Création...
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</template>
