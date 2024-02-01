<script setup lang="ts">
import { Toaster } from '@/components/ui/toast'
</script>

<template>
  <div class="h-screen flex justify-center items-center p-6">
    <slot />

    <Toaster />
  </div>
</template>
