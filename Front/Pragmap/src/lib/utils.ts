import type { Ref } from 'vue'
// import { camelize, getCurrentInstance, toHandlerKey } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import i18next from 'i18next'
import { z } from 'zod'
import { zodI18nMap } from 'zod-i18n-map'
import translation from '@/lib/zod.json'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const valueUpdater = <T extends Updater<any>>(updaterOrValue: T, ref: Ref) => {
	ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

export const convertToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = (error) => reject(error)
	})
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

i18next.init({
	lng: 'fr',
	resources: {
		fr: { zod: translation }
	}
})
z.setErrorMap(zodI18nMap)

export { z }
