<script setup lang="ts">
import { CSSProperties } from "vue";

import { Tile } from "../types";

const props = defineProps<{ tile: Tile }>();

const computedStyle: CSSProperties = {
  gridColumn: `${props.tile.x + 1}/${props.tile.x + 2}`,
  gridRow: `${props.tile.y + 1}/${props.tile.y + 2}`,
};
</script>

<template>
  <div
    class="cell"
    :id="`${tile.x}-${tile.y}`"
    :style="computedStyle"
    :class="{ active: tile.value }"
  ></div>
</template>

<style scoped>
.cell {
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  background-color: rgba(238, 228, 218, 0.35);
}
</style>
