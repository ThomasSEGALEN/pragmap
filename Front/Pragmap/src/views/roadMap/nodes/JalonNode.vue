<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'
import { Trophy } from 'lucide-vue-next';
import { useNode } from '@vue-flow/core'
import { ref } from 'vue';


// `useNode` returns us the node object straight from the state
// since the node obj is reactive, we can mutate it to update our nodes' data
const { node } = useNode()
const showDetails = ref(false);
console.log(node.data)

const emit = defineEmits(['nodeClicked']);
</script>

<template>
  <div class="jalonNode" v-on:click="$emit('nodeClicked', node.id)">
    <p>{{ node.data.nom }}</p>
    <Handle type="source" :position="Position.Left"/>
    <Handle type="target" :position="Position.Right"/>
    <Trophy />
  </div>
</template>

<style scoped>
.jalonNode {
  height: 100%;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
  border: 1px solid yellow;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
}


</style>
