<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-vue-next'

defineProps<{
  id: string
	name: string
	notify: (status: string, message: string) => void
	deleteEntity: (id: string) => void
}>()

const copy = (id: string) => navigator.clipboard.writeText(id)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Actions</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(id)">
				Copier l'ID
			</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <RouterLink :to="{ name: name, params: { id: id } }">
          Modifier
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem @click="deleteEntity(id)">
				Supprimer
			</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
