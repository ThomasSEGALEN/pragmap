<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui//button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

defineProps<{
  table: Table<TData>
}>()
</script>

<template>
  <div class="flex flex-col justify-between space-y-2 sm:flex-row sm:space-y-0">
    <Input
      class="sm:max-w-[250px]"
      placeholder="Rechercher par adresse e-mail"
      :model-value="table.getColumn('Adresse e-mail')?.getFilterValue() as string"
      @update:model-value="table.getColumn('Adresse e-mail')?.setFilterValue($event)"
    />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline">
          Columns
          <ChevronDown class="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
          :key="column.id"
          :checked="column.getIsVisible()"
          @update:checked="
            (value) => {
              column.toggleVisibility(!!value)
            }
          "
        >
          {{ column.id }}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
