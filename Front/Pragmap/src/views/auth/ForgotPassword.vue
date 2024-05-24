<script setup lang="ts">
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { cn, sleep, z } from '@/lib/utils'
import { authService } from '@/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { toast } from '@/components/ui/toast'

const emailInput = ref<HTMLInputElement | null>(null)
useFocus(emailInput, { initialValue: true })
const formSchema = toTypedSchema(
	z.object({
		email: z.string().trim().min(1, { message: 'Obligatoire' }).max(254).email()
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		await authService.forgotPassword(values)
		await sleep(250)

		toast({
			title: 'Succès',
			description: `Un mail a été envoyé à l'adresse e-mail ${values.email}.`,
			duration: 5000
		})
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `Nous ne sommes pas parvenus à envoyer un mail à l'adresse e-mail ${values.email}.`,
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
				Renseignez votre adresse e-mail afin de recevoir un lien de réinitialisation de mot de passe
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				class="space-y-6"
				@submit="onSubmit"
			>
				<FormField
					v-slot="{ componentField }"
					name="email"
				>
					<FormItem>
						<FormLabel>Adresse e-mail</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								ref="emailInput"
								type="email"
								autocomplete="email"
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
						<RouterLink to="/login">&#x2190; Retour à la connexion</RouterLink>
					</Button>
					<Button
						v-if="!isSubmitting"
						type="submit"
					>
						<Send class="h-4 w-4 mr-2" />
						Envoyer
					</Button>
					<Button
						v-else
						disabled
					>
						<Loader2 class="h-4 w-4 mr-2 animate-spin" />
						Envoi...
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</template>
