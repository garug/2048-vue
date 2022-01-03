<script setup lang="ts">
import { CSSProperties } from "vue";

import { ValuedTile } from "../types";

const props = defineProps<{ tile: ValuedTile }>();

function styleValued(): CSSProperties {
  const tile = props.tile;

  return {
    gridColumn: `${tile.x + 1}/${tile.x + 2}`,
    gridRow: `${tile.y + 1}/${tile.y + 2}`,
  };
}
</script>

<template>
  <div
    class="valued-cell"
    :class="`cell-${tile.value}`"
    :style="styleValued()"
    :key="tile.id"
    :id="tile.id"
    :data-axis-x="tile.x"
    :data-axis-y="tile.y"
  >
    {{ tile.value }}
  </div>
</template>

<style scoped>
.valued-cell {
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  font-weight: 700;
  color: #776e65;
  border-radius: 3px;
  transition: transform ease 0.1s, background-color 0.1s 0.1s linear,
    box-shadow 0.1s 0.1s linear;
}

@media (min-width: 1024px) {
  .valued-cell {
    font-size: 55px;
  }
}

.cell-2 {
  background-color: #eee4da;
  box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
}

.cell-4 {
  background-color: #ede0c8;
  box-shadow: 0 0 30px 10px transparent, inset 0 0 0 1px transparent;
}

.cell-8 {
  color: #f9f6f2;
  background-color: #f2b179;
}

.cell-16 {
  color: #f9f6f2;
  background-color: #f59563;
}

.cell-32 {
  color: #f9f6f2;
  background-color: #f67c5f;
}

.cell-64 {
  color: #f9f6f2;
  background-color: #f65e3b;
}

.cell-128 {
  color: #f9f6f2;
  background-color: #edcf72;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.2381),
    inset 0 0 0 1px rgba(255, 255, 255, 0.14286);
  font-size: 25px;
}

@media (min-width: 1024px) {
  .cell-128 {
    font-size: 45px;
  }
}

.cell-256 {
  color: #f9f6f2;
  background-color: #edcc61;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.31746),
    inset 0 0 0 1px rgba(255, 255, 255, 0.19048);
  font-size: 25px;
}

@media (min-width: 1024px) {
  .cell-256 {
    font-size: 45px;
  }
}

.cell-512 {
  color: #f9f6f2;
  background-color: #edc850;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.39683),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2381);
  font-size: 25px;
}

@media (min-width: 1024px) {
  .cell-512 {
    font-size: 45px;
  }
}

.cell-1024 {
  color: #f9f6f2;
  background-color: #edc53f;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619),
    inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
  font-size: 20px;
}

@media (min-width: 1024px) {
  .cell-1024 {
    font-size: 35px;
  }
}

.cell-2048,
.cell-4096,
.cell-8192 {
  color: #f9f6f2;
  background-color: #edc22e;
  box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556),
    inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
  font-size: 20px;
}

@media (min-width: 1024px) {
  .cell-2048,
  .cell-4096,
  .cell-8192 {
    color: #f9f6f2;
    background-color: #edc22e;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.55556),
      inset 0 0 0 1px rgba(255, 255, 255, 0.33333);
    font-size: 35px;
  }
}
</style>
