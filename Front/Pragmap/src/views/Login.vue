<script setup lang="ts">
import router from '@/router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores'
import { GuestLayout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { toast } from '@/components/ui/toast'

const authStore = useAuthStore()
const formSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: 'Le champ est obligatoire' })
      .email({ message: 'Le champ doit être une adresse e-mail valide' }),
    password: z
      .string({ required_error: 'Le champ est obligatoire' })
      .min(6, { message: 'Le champ doit contenir au minimum 6 caractères' })
  })
)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password)

    router.push('/')
  } catch (error) {
    toast({
      title: 'Erreur',
      description: `Nous ne sommes pas parvenus à vous connecter avec ces identifiants.`,
      duration: 5000
    })
  }
})
</script>

<template>
  <GuestLayout>
    <Card :class="cn('w-[420px]', $attrs.class ?? '')">
      <CardHeader>
        <CardTitle>Pragmap</CardTitle>
        <CardDescription>Connectez-vous pour accéder à l'application</CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-6" @submit="onSubmit">
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

          <div class="flex flex-col sm:flex-row justify-between">
						<Button type="button" variant="link" size="sm" as-child>
              <RouterLink to="/forgot-password">Mot de passe oublié ?</RouterLink>
            </Button>

            <Button v-if="!isSubmitting" type="submit">
              <Send class="w-4 h-4 mr-2" />
              Se connecter
            </Button>
            <Button v-else type="disabled">
              <Loader2 class="w-4 h-4 mr-2 animate-spin" />
              Connexion...
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </GuestLayout>
</template>
