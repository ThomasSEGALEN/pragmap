import type { Ref } from 'vue'
// import { camelize, getCurrentInstance, toHandlerKey } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from '@/lib/zod.json'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
	ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

i18next.init({
	lng: 'fr',
	resources: {
		fr: { zod: translation }
	}
})
z.setErrorMap(zodI18nMap)

export { z }
