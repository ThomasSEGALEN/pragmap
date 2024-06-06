<script setup lang="ts">
import { ref } from 'vue'
import { useFocus } from '@vueuse/core'
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
const emailInput = ref<HTMLInputElement | null>(null)
useFocus(emailInput, { initialValue: true })
const formSchema = toTypedSchema(
	z.object({
		email: z.string().min(1, { message: 'Obligatoire' }).max(254).email()
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		const data = {
			userId: authStore.user.id,
			email: values.email
		}

		await userService.askEmailUpdate(data)

		toast({
			title: 'Succès',
			description: 'Un mail a été envoyé à votre précédente adresse e-mail.',
			duration: 5000
		})
	} catch (error) {
		toast({
			title: 'Erreur',
			description:
				'Nous ne sommes pas parvenus à envoyer un mail à votre précédente adresse e-mail.',
			duration: 5000
		})
	}
})
</script>

<template>
	<Card :class="cn('h-fit max-w-[420px]', $attrs.class ?? '')">
		<CardHeader>
			<CardTitle>Modification de l'adresse e-mail</CardTitle>
			<CardDescription>Renseignez votre nouvelle adresse e-mail</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				class="flex flex-col items-stretch md:items-end space-y-6"
				@submit="onSubmit"
			>
				<FormField
					v-slot="{ componentField }"
					name="email"
				>
					<FormItem class="w-full">
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
					Envoi...
				</Button>
			</form>
		</CardContent>
	</Card>
</template>
