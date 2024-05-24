<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { cn, sleep, z } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { toast } from '@/components/ui/toast'

const router = useRouter()
const { login } = useAuthStore()
const emailInput = ref<HTMLInputElement | null>(null)
useFocus(emailInput, { initialValue: true })
const formSchema = toTypedSchema(
	z.object({
		email: z.string().min(1, { message: 'Obligatoire' }).max(254).email(),
		password: z.string().trim().min(1, { message: 'Obligatoire' }).max(255)
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		await login(values)
		await sleep(250)

		router.push('/')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: 'Nous ne sommes pas parvenus à vous connecter avec ces identifiants.',
			duration: 5000
		})
	}
})
</script>

<template>
	<Card :class="cn('w-[420px]', $attrs.class ?? '')">
		<CardHeader>
			<CardTitle>Pragmap</CardTitle>
			<CardDescription>Connectez-vous pour accéder à l'application</CardDescription>
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
								autocomplete="current-password"
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
						<RouterLink to="/forgot-password">Mot de passe oublié ?</RouterLink>
					</Button>
					<Button
						v-if="!isSubmitting"
						type="submit"
					>
						<Send class="h-4 w-4 mr-2" />
						Se connecter
					</Button>
					<Button
						v-else
						disabled
					>
						<Loader2 class="h-4 w-4 mr-2 animate-spin" />
						Connexion...
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</template>
