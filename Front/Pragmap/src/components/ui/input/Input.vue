<script setup lang="ts">
import { ref, useAttrs, type HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps<{
	defaultValue?: string | number
	modelValue?: string | number
	class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: props.defaultValue
})

const inputType = useAttrs().type

const showPassword = ref<boolean>(false)

const refValue = ref<HTMLInputElement | null>(null)

defineExpose({
	refValue
})
</script>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>

<template>
	<input
		v-if="inputType !== 'password'"
		v-bind="$attrs"
		v-model="modelValue"
		:class="
			cn(
				'relative flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-primary file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				props.class
			)
		"
	/>
	<div
		v-else
		class="relative"
	>
		<input
			v-bind="$attrs"
			v-model="modelValue"
			ref="refValue"
			:type="showPassword ? 'text' : inputType"
			:class="
				cn(
					'relative flex h-10 w-full rounded-md border border-input bg-background pl-3 pr-12 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-primary file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
					props.class
				)
			"
		/>
		<template v-if="inputType === 'password'">
			<Button
				class="absolute top-0 right-0 flex justify-center items-center"
				type="button"
				variant="link"
				size="icon"
				@click="showPassword = !showPassword"
			>
				<Eye
					v-if="showPassword"
					class="h-4 w-4"
				/>
				<EyeOff
					v-else
					class="h-4 w-4"
				/>
			</Button>
		</template>
	</div>
</template>
