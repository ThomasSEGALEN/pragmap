<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { ref } from 'vue'

const defaultText = 'OutpudNode'
</script>

<template>
  <div class="outputNode">
    <Handle type="source" :position="Position.Left"/>
    <p>{{ defaultText }}</p>
  </div>
</template>

<style scoped>
.outputNode {
  height: 100%;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  border: 1px solid red;
  border-radius: 4px;
}
</style>
