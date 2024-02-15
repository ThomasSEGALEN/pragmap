<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { LayoutList } from 'lucide-vue-next';
import { useNode } from '@vue-flow/core'

// `useNode` returns us the node object straight from the state
// since the node obj is reactive, we can mutate it to update our nodes' data
const { node } = useNode()
const emit = defineEmits(['nodeClicked']);
</script>

<template>
  <div class="tacheNode" v-on:click="$emit('nodeClicked', node.id)">
    <p>{{ node.data.nom }}</p>
    <Handle class="handle" type="source" :position="Position.Left"/>
    <Handle class="handle" type="target" :position="Position.Right"/>
    <Handle class="handle" type="source" :position="Position.Bottom"/>
    <LayoutList />
  </div>
</template>

<style scoped>
.tacheNode {
  padding: 1rem;
  display: flex;
  flex-direction: column-reverse;
  background: white;
  border-radius: 4px;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
  
}
.handle:before{
  visibility: hidden;
}

.handle:hover {
  visibility: visible;
}

#text {
  border: none; /* Remove border */
text-align: center;
}
</style>
