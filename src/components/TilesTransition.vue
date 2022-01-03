<script setup lang="ts">
import { transitionTime } from "../constants";
import { ValuedTile } from "../types";

const props = defineProps<{ valuedTiles: ValuedTile[] }>();

function beforeEnter(el: any) {
  el.style.transform = "scale(0)";
  el.style.opacity = 0;
}

function enter(el: any, done: any) {
  setTimeout(() => {
    el.style.transform = "scale(1)";
    el.style.opacity = 1;
    done();
  }, transitionTime);
}

function beforeLeave(el: any) {
  const mergeId = el.getAttribute("data-merge-into");

  const mergeInto = document.getElementById(mergeId)!;

  const mergeTile = props.valuedTiles.find((e) => e.id === mergeId);

  if (!mergeTile) {
    el.style.setProperty("transform", "scale(0)");
    return;
  }

  const axs = mergeTile
    ? { x: mergeTile.x, y: mergeTile.y }
    : {
        x: Number.parseInt(mergeInto.getAttribute("data-axis-x")!),
        y: Number.parseInt(mergeInto.getAttribute("data-axis-y")!),
      };

  const position = `${axs.y + 1} / ${axs.x + 1} / ${axs.y + 2} / ${axs.x + 2}`;

  mergeInto.style.setProperty("z-index", mergeInto.innerText);
  el.style.setProperty(
    "z-index",
    (Number.parseInt(mergeInto.innerText) / 2).toString()
  );
  el.style.setProperty("grid-area", position);
}

function leave(_: Element, done: () => void) {
  setTimeout(done, transitionTime);
}
</script>
<template>
  <transition-group
    :css="false"
    @before-enter="beforeEnter"
    @enter="enter"
    @before-leave="beforeLeave"
    @leave="leave"
    name="tiles"
  >
    <slot></slot>
  </transition-group>
</template>
