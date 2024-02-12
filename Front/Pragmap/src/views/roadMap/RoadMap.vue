<template>
  <Layout>
    <div>
      <div class="navbar">
        <button @click="addNode('inputed', 'inputed')">Input</button>
        <button @click="addNode('outputed','outputed')">Output</button>
        <button @click="saveNode()">Save</button>
        <button @click="importNode()">Load</button>
      </div>
      <VueFlow v-model="elements" class="vue-flow-basic-example" :default-zoom="1" :min-zoom="0.2" :max-zoom="4" style="height: 80vh;">
        <Background pattern-color="#aaa" gap="8" />
        <MiniMap />
        <template #node-inputed="nodeProps">
          <InputNode v-bind="nodeProps" />
        </template>
        <template #node-outputed="nodeProps">
          <OutputNode v-bind="nodeProps" />
        </template>
      </VueFlow>
    </div>
  </Layout>
</template>

<script lang="ts" setup>
import { MiniMap, Background } from '@vue-flow/additional-components'
import { Layout } from '@/components/layouts'
import { useVueFlow } from '@vue-flow/core'
import { VueFlow, type Elements } from '@vue-flow/core'
import InputNode from './nodes/InputNode.vue'
import OutputNode from './nodes/OutputNode.vue'
import { ref, watch } from 'vue'
import '../css/roadap.css'
import type { ElementData } from '@vue-flow/core'
const { onConnect, addEdges } = useVueFlow()
onConnect((params) => {
  addEdges([params])
})
const elements = ref<Elements>([])
var json = JSON.stringify(elements.value)

const addNode = (type: string, text: String) => {
  const id = (elements.value.length + 1);
  console.log(id);
  elements.value.push({
    id: id.toString(),
    type: type,
    data: { label: `Node ${id}`},
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    label: text,
    animated: true
  });
};
const saveNode = () => {
  json = JSON.stringify(elements.value);
  console.log(json);
};
const importNode = () => {
  if (json) {
    elements.value = JSON.parse(json);
  }
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