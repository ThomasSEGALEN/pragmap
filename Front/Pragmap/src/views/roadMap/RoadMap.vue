<template>
  <div style="height: 100vh;">
    <div class="navbar">
      <button @click="addNode('input')">Ajouter un nœud d'entrée</button>
      <button @click="addNode('output')">Ajouter un nœud de sortie</button>
      <button @click="addNode('default')">Ajouter un nœud par défaut</button>
    </div>
    <VueFlow v-model="elements" class="vue-flow-basic-example" :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4">
      <Background pattern-color="#aaa" gap="8" />
      <MiniMap />
    </VueFlow>
  </div>
</template>

<script lang="ts" setup>
import { MiniMap, Background } from '@vue-flow/additional-components'
import { useVueFlow } from '@vue-flow/core';
import { VueFlow, type Elements } from '@vue-flow/core'
import { ref } from 'vue'
import '../css/roadap.css'
const { onConnect, addEdges } = useVueFlow()
onConnect((params) => {
  addEdges([params])
})
const elements = ref<Elements>([])

const addNode = (type: string) => {
  const id = (elements.value.length + 1).toString();
  elements.value.push({
    id,
    type,
    data: { label: `Node ${id}` },
    position: {
      x: Math.random() * 400,
      y: Math.random() * 400,
    },
  });
};
</script>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f8f8f8;
}
</style>