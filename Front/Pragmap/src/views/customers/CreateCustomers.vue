<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { Layout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
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
import { useAuthStore } from '@/stores'
import { customerService } from '@/services'

const { roles } = useAuthStore()
const formSchema = toTypedSchema(
  z.object({
		name: z.string({ required_error: 'Le champ est obligatoire' }),
		logo: z.string({ required_error: 'Le champ est obligatoire' }).optional()
  })

)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	console.log('PATRICK');
	
    console.log(values);
	const data = {
		name: values.name,
		logo: "values.logo",
		userIds: [
			"796b3a89-eb6a-44b5-815c-7e4f17a47d3d",
			"095396d7-e8f8-4b0c-a4a1-afe2e1c651ca",
			"29cf10bf-220c-4e51-9609-65f40c010c54",
		]
	}
    
  try {
		await customerService.create(data)

    router.push('/customers')
  } catch (error) {
    toast({
      title: 'Erreur',
      description: `Nous ne sommes pas parvenus à créer un utilisateur.`,
      duration: 5000
    })
  }
})

const  handleLogoChange = (event) =>{
        const file = event.target.files[0]
        // Faites quelque chose avec le fichier, par exemple l'envoyer au serveur
    }
</script>

<template>
  <Layout>
		<Card :class="cn('w-[420px]', $attrs.class ?? '')">
      <CardHeader>
        <CardTitle>Création d'un client</CardTitle>
      </CardHeader>

      <CardContent>
				<form class="space-y-6" @submit="onSubmit">
					<div class="flex flex-row justify-between space-x-4">
						<FormField v-slot="{ componentField }" name="name">
							<FormItem class="w-full">
								<FormLabel>Nom</FormLabel>
								<FormControl>
									<Input v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
					<div class="flex flex-row justify-between space-x-4">
                        <FormField v-slot="{ componentField }" name="logo">
                            <FormItem class="w-full">
                                <FormLabel>Logo</FormLabel>
                                <FormControl>
                                    <!-- Champ d'entrée de l'image -->
                                    <Input v-bind="componentField" type="file" accept="image/*" @change="handleLogoChange" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
					</div>
					<div class="flex flex-col sm:flex-row justify-between">
                        <Button type="button" variant="link" size="sm" as-child>
                            <RouterLink to="/login">&#x2190; Retour</RouterLink>
                        </Button>

						<Button v-if="!isSubmitting" type="submit">
							Créer
						</Button>
						<Button v-else type="disabled">
							<Loader2 class="w-4 h-4 mr-2 animate-spin" />
							Création...
						</Button>
					</div>
				</form>
			</CardContent>
    </Card>
  </Layout>
</template>
