<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { cn, z } from '@/lib/utils'
import { userService } from '@/services'
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'

const authStore = useAuthStore()
const formSchema = toTypedSchema(
	z
		.object({
			currentPassword: z.string().trim().min(1, { message: 'Obligatoire' }).max(255),
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
			passwordConfirmation: z.string().trim().min(1, { message: 'Obligatoire' }).max(255)
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
		const data = {
			userId: authStore.user.id,
			oldPassword: values.currentPassword,
			newPassword: values.password
		}

		await userService.updatePassword(data)

		setTimeout(() => {
			toast({
				title: 'Succès',
				description: 'Votre mot de passe a été modifié, veuillez vous reconnecter.',
				duration: 5000
			})
		}, 100)
	} catch (error) {
		toast({
			title: 'Erreur',
			description: 'Nous ne sommes pas parvenus à modifier votre mot de passe.',
			duration: 5000
		})
	}
})
</script>

<template>
	<Card :class="cn('h-fit max-w-[420px]', $attrs.class ?? '')">
		<CardHeader>
			<CardTitle>Modification du mot de passe</CardTitle>
			<CardDescription>Renseignez votre nouveau mot de passe</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				class="flex flex-col items-stretch md:items-end space-y-6"
				@submit="onSubmit"
			>
				<FormField
					v-slot="{ componentField }"
					name="currentPassword"
				>
					<FormItem class="w-full">
						<FormLabel>Mot de passe actuel</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								type="password"
								autocomplete="current-password"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-slot="{ componentField }"
					name="password"
				>
					<FormItem class="w-full">
						<FormLabel>Nouveau mot de passe</FormLabel>
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
					<FormItem class="w-full">
						<FormLabel>Confirmation du nouveau mot de passe</FormLabel>
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
				<Button
					v-if="!isSubmitting"
					type="submit"
				>
					Modifier
				</Button>
				<Button
					v-else
					disabled
				>
					<Loader2 class="h-4 w-4 mr-2 animate-spin" />
					Modification...
				</Button>
			</form>
		</CardContent>
	</Card>
</template>
