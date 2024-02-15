<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { FileText } from 'lucide-vue-next';

import { useNode } from '@vue-flow/core'

// `useNode` returns us the node object straight from the state
// since the node obj is reactive, we can mutate it to update our nodes' data
const { node } = useNode()

const emit = defineEmits(['nodeClicked']);
</script>
<template>
  <div class="livrableNode" v-on:click="$emit('nodeClicked', node.id)">
    <p>{{ node.data.nom }}</p>
    <Handle type="source" :position="Position.Top"/>
    <FileText />
  </div>
</template>

<style scoped>
.livrableNode {
  height: 100%;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  border: 1px solid green;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
}
</style>
