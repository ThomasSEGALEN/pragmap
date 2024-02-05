<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { ref } from 'vue'

const counter = ref(0)
const defaultText = 'InputNode'
</script>

<template>
  <div class="inputNode">
    <Handle type="target" :position="Position.Right"/>
    <p>{{ defaultText }}</p>
  </div>
</template>

<style scoped>
.inputNode {
  height: 100%;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  border: 1px solid green;
  border-radius: 4px;
}
</style>
