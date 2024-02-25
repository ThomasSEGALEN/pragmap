<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { authService } from '@/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { toast } from '@/components/ui/toast'

const router = useRouter()
const { query } = useRoute()
const { resetPassword } = authService
const formSchema = toTypedSchema(
	z
		.object({
			password: z
				.string({
					required_error: 'Le champ est obligatoire',
					invalid_type_error: 'Le champ est invalide'
				})
				.min(1, { message: 'Le champ est obligatoire' })
				.min(6, { message: 'Le champ doit contenir au minimum 6 caractères' }),
			passwordConfirmation: z
				.string({
					required_error: 'Le champ est obligatoire',
					invalid_type_error: 'Le champ est invalide'
				})
				.min(1, { message: 'Le champ est obligatoire' })
				.min(6, { message: 'Le champ doit contenir au minimum 6 caractères' })
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
		if (!query.token) throw new Error('Token is missing')

		resetPassword(query.token.toString(), values.password)

		router.push('/login')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: 'Nous ne sommes pas parvenus à réinitialiser votre mot de passe.',
			duration: 5000
		})
	}
})
</script>

<template>
	<Card :class="cn('w-[420px]', $attrs.class ?? '')">
		<CardHeader>
			<CardTitle>Pragmap</CardTitle>
			<CardDescription>
				Renseignez un nouveau mot de passe afin de le réinitialiser
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				class="space-y-6"
				@submit="onSubmit"
			>
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
								autofocus
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
						type="button"
						variant="link"
						size="sm"
						as-child
					>
						<RouterLink to="/login">&#x2190; Retour à la connexion</RouterLink>
					</Button>
					<Button
						v-if="!isSubmitting"
						type="submit"
					>
						<Send class="h-4 w-4 mr-2" />
						Réinitialiser
					</Button>
					<Button
						v-else
						type="disabled"
					>
						<Loader2 class="h-4 w-4 mr-2 animate-spin" />
						Réinitialisation...
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</template>
