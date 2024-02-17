<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'
import Multiselect from 'vue-multiselect'

const props = defineProps<{
	defaultValue?: Array<Record<'label' | 'value', string>> | Array<string> | null
	modelValue: Array<Record<'label' | 'value', string>> | Array<string> | null
	options: Array<Record<'label' | 'value', string>>
	placeholder?: string
	message?: string
	limitText?: Record<'singular' | 'plural', string>
	class?: string
}>()

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: props.defaultValue
})
</script>

<template>
	<div class="relative z-0">
		<Multiselect
			:class="cn('flex h-10 w-full', props.class ?? '')"
			v-model="modelValue"
			:options="options"
			:value="String"
			:multiple="true"
			:close-on-select="false"
			:clear-on-select="false"
			:preserve-search="true"
			:placeholder="placeholder ?? 'Sélectionner des options'"
			label="label"
			track-by="value"
			:preselect-first="false"
			select-label=""
			deselect-label=""
			selected-label=""
			:limit="0"
			:limit-text="
				(count: number) =>
					`${count} ${count === 1 ? limitText?.singular ?? 'option sélectionnée' : limitText?.plural ?? 'options sélectionnées'}`
			"
		>
			<template #noOptions>{{ message ?? 'Aucune option trouvée' }}</template>
			<template #noResult>{{ message ?? 'Aucun résultat trouvé' }}</template>
		</Multiselect>
	</div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.multiselect--active {
	.multiselect__tags-wrap,
	.multiselect__strong {
		@apply hidden;
	}
	.multiselect__select {
		@apply z-10;
	}
}
.multiselect__select::before {
	@apply border-t-primary;
}
.multiselect__tags-wrap {
	@apply space-x-1;
}
.multiselect__strong {
	@apply p-0 m-0 text-sm font-medium text-primary;
}
.multiselect__tags {
	@apply py-0 px-2 flex justify-start items-center space-x-2 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50;
}
.multiselect__tags input {
	@apply p-0 m-0 bg-inherit;
}
.multiselect__tags input::placeholder,
input:focus {
	@apply text-sm text-primary;
}
.multiselect__placeholder {
	@apply p-0 m-0 text-primary;
}
/* .multiselect__tag {
	@apply m-0 inline-flex justify-center items-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90;
}
.multiselect__tag-icon {
	@apply inline-flex justify-center items-center;
}
.multiselect__tag-icon::after {
	@apply text-secondary;
} */
.multiselect__single {
	@apply hidden;
}
.multiselect__content-wrapper {
	@apply text-sm font-medium border border-input ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary-foreground text-primary;
}
.multiselect__option--selected {
	@apply bg-primary text-primary-foreground;
}
.multiselect__option--highlight {
	@apply bg-primary/90 text-primary-foreground;
}
.multiselect__option--selected.multiselect__option--highlight {
	@apply bg-primary text-primary-foreground;
}
</style>
