<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { customerService } from '@/services'
import { useAuthStore } from '@/stores'
import { useCustomerStore } from '@/stores'
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
const  handleLogoChange = (event) =>{
        const file = event.target.files[0]
        // Faites quelque chose avec le fichier, par exemple l'envoyer au serveur
    }
const { editCustomer, clearEditCustomer } = useCustomerStore()
const formSchema = toTypedSchema(
	z.object({
		id: z.string().default(id),
		name: z
			.string({ required_error: 'Le champ est obligatoire' })
			.default(editCustomer?.name ?? ''),
		logo: z
			.string({ required_error: 'Le champ est obligatoire' }).optional()
			.default(editCustomer?.logo ?? ''),
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		await customerService.update(id, values)

		clearEditCustomer()

		router.push('/customers')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `Nous ne sommes pas parvenus à créer un client.`,
			duration: 5000
		})
	}
})
</script>

<template>
	<Layout>
		<Card :class="cn('w-[420px]', $attrs.class ?? '')">
			<CardHeader>
				<CardTitle>Modification d'un Client</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					class="space-y-6"
					@submit="onSubmit"
				>
					<div class="flex flex-row justify-between space-x-4">
						<FormField
							v-slot="{ componentField }"
							name="name"
						>
							<FormItem class="w-full">
								<FormLabel>Nom</FormLabel>
								<FormControl>
									<Input v-bind="componentField" />
								</FormControl>
								<FormMessage />
							</FormItem>
						</FormField>
					</div>
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
					<div class="flex flex-col sm:flex-row justify-between">
						<Button
							type="button"
							variant="link"
							size="sm"
							as-child
						>
							<RouterLink to="/login">&#x2190; Retour</RouterLink>
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
