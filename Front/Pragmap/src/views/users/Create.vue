<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Layout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'
import { userService } from '@/services'

const formSchema = toTypedSchema(
  z.object({
		firstName: z.string({ required_error: 'Le champ est obligatoire' }),
		lastName: z.string({ required_error: 'Le champ est obligatoire' }),
    email: z
      .string({ required_error: 'Le champ est obligatoire' })
      .email({ message: 'Le champ doit être une adresse e-mail valide' }),
    password: z
      .string({ required_error: 'Le champ est obligatoire' })
      .min(6, { message: 'Le champ doit contenir au minimum 6 caractères' }),
		role: z.string({ required_error: 'Le champ est obligatoire' })
  })
)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
  try {
		const v = {
			"email": "test@test.com",
			"password": "Test123!",
			"firstName": "Test",
			"lastName": "Test",
			"role": {
				"id": "9cbd4ae2-5ca1-44f7-8d9f-176dd647398c",
				"name": "Lecteur",
			}
		}

		const data = await userService.create(v)

		console.log(data)

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
    <div :class="cn('w-[420px]', $attrs.class ?? '')">
			<form class="space-y-6" @submit="onSubmit">
				<FormField v-slot="{ componentField }" name="lastName">
					<FormItem>
						<FormLabel>Nom</FormLabel>
						<FormControl>
							<Input v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="firstName">
					<FormItem>
						<FormLabel>Prénom</FormLabel>
						<FormControl>
							<Input v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>Adresse e-mail</FormLabel>
						<FormControl>
							<Input type="email" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="password">
					<FormItem>
						<FormLabel>Mot de passe</FormLabel>
						<FormControl>
							<Input type="password" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="role">
					<FormItem>
						<FormLabel>Rôle</FormLabel>
						<FormControl>
							<Input v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>

				<div class="flex flex-col sm:flex-row justify-between">
					<Button v-if="!isSubmitting" type="submit">
						Créer
					</Button>
					<Button v-else type="disabled">
						<Loader2 class="w-4 h-4 mr-2 animate-spin" />
						Création...
					</Button>
				</div>
			</form>
		</div>
  </Layout>
</template>
