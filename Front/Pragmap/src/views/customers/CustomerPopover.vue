<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { type ICustomerUser } from '@/types'
import { userService } from '@/services'

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
})
</script>

<template>
	<Popover>
		<PopoverTrigger>
			<Button
				class="px-0"
				variant="link"
			>
				Consulter
			</Button>
		</PopoverTrigger>
		<PopoverContent>
			<ul>
				<li
					v-for="user in users"
					:key="user.id"
				>
					{{ user.name }}
				</li>
			</ul>
		</PopoverContent>
	</Popover>
</template>
