<script setup lang="ts">
import { Toaster } from '@/components/ui/toast'
</script>

<template>
  <div class="h-full flex justify-center items-center">
    <slot />

    <Toaster />
  </div>
</template>
