<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFocus } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { cn, sleep, z } from '@/lib/utils'
import { roadmapService } from '@/services'
import { useFormStore } from '@/stores'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'

const { id } = useRoute().params as { id: string }
const router = useRouter()
const nameInput = ref<HTMLInputElement | null>(null)
useFocus(nameInput, { initialValue: true })
const { editRoadmap } = useFormStore()
const formSchema = toTypedSchema(
	z.object({
		id: z.string().default(id),
		name: z
			.string()
			.trim()
			.min(1, { message: 'Obligatoire' })
			.max(255)
			.default(editRoadmap?.name ?? '')
	})
)
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: formSchema
})
const onSubmit = handleSubmit(async (values) => {
	try {
		await roadmapService.update(id, values)
		await sleep(500)

		router.push('/roadmaps')
	} catch (error) {
		toast({
			title: 'Erreur',
			description: `Nous ne sommes pas parvenus à modifier la roadmap.`,
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
					name="name"
				>
					<FormItem class="w-full">
						<FormLabel>Nom</FormLabel>
						<FormControl>
							<Input
								v-bind="componentField"
								ref="nameInput"
								autocomplete="organization"
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
						<RouterLink to="/roadmaps">&#x2190; Retour</RouterLink>
					</Button>
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
				</div>
			</form>
		</CardContent>
	</Card>
</template>
