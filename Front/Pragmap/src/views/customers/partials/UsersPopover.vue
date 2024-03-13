<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from '@/services'
import type { ICustomerUser } from '@/types'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const { customerUsers } = defineProps<{ customerUsers: Array<ICustomerUser> }>()

const users = ref<Array<Record<'id' | 'name', string>>>([])
onMounted(async () => {
	users.value = await Promise.all(
		customerUsers.map(async (customerUser) => {
			const user = await userService.getById(customerUser.userId, {
				select: ['id', 'lastName', 'firstName']
			})

			return {
				id: user.id,
				name: `${user.lastName.charAt(0).toUpperCase() + user.lastName.substring(1)} ${user.firstName.charAt(0).toUpperCase() + user.firstName.substring(1)}`
			}
		})
	)
	users.value.sort((a, b) => a.name.localeCompare(b.name))
})
</script>

<template>
	<Popover>
		<PopoverTrigger as-child>
			<Button
				class="px-0 focus-visible:bg-background"
				variant="link"
			>
				Consulter
			</Button>
		</PopoverTrigger>
		<PopoverContent>
			<h4 class="font-medium leading-none text-md">Utilisateurs :</h4>
			<ul
				v-if="users.length"
				class="mt-2"
			>
				<li
					v-for="user in users"
					:key="user.id"
					class="ml-6 list-disc"
				>
					{{ user.name }}
				</li>
			</ul>
			<div
				v-else
				class="mt-2 text-muted-foreground"
			>
				Aucun utilisateur
			</div>
		</PopoverContent>
	</Popover>
</template>
