<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CalendarDays, FileText, ListTodo } from 'lucide-vue-next'

defineProps<{
	id: string
}>()
</script>

<template>
	<div class="flex space-x-2">
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger as-child>
					<Button
						variant="outline"
						size="icon"
						as-child
					>
						<RouterLink :to="{ name: 'RoadmapsSchedule', params: { id: id } }">
							<CalendarDays class="h-4 w-4" />
						</RouterLink>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Planning</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger as-child>
					<Button
						variant="outline"
						size="icon"
						as-child
					>
						<RouterLink :to="{ name: 'RoadmapsTasks', params: { id: id } }">
							<ListTodo class="h-4 w-4" />
						</RouterLink>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Tâches</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger as-child>
					<Button
						variant="outline"
						size="icon"
						as-child
					>
						<RouterLink :to="{ name: 'RoadmapsDeliverables', params: { id: id } }">
							<FileText class="h-4 w-4" />
						</RouterLink>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Livrables</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
</template>
