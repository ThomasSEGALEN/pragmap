<template>
  <g class="rectangle-node">
    <rect :x="x" :y="y" :width="width" :height="height" stroke="black" fill="transparent" />
    <!-- Vous pouvez ajouter d'autres éléments SVG ici pour représenter le contenu du groupe -->
  </g>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

interface GroupeNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default defineComponent({
  props: {
    rectangle: {
      type: Object as PropType<GroupeNode>,
      required: true,
    },
  },
  computed: {
    x() {
      return this.rectangle.x;
    },
    y() {
      return this.rectangle.y;
    },
    width() {
      return this.rectangle.width;
    },
    height() {
      return this.rectangle.height;
    },
  },
});
</script>