<script setup lang="ts">
import { computed, reactive, onMounted, ref, watch, CSSProperties } from "vue";
import { groupBy, remove } from "lodash";

import { MovingTile, Tile, ValuedTile, Board, Direction } from "../types";
import { transitionTime } from "../constants";

import Cell from "./Cell.vue";
import ValuedCell from "./ValuedCell.vue";
import TilesTransition from "./TilesTransition.vue";
import GameOver from "./GameOver.vue";
import Win from "./Win.vue";

const props = defineProps<{ size: number; loadTiles?: Array<ValuedTile> }>();

const matrix: Tile[][] = reactive(
  Array.from({ length: props.size }).map((_, column) => {
    return Array.from({ length: props.size }).map((__, row) => {
      return {
        value: 0,
        id: `${row}-${column}`,
        x: row,
        y: column,
      };
    });
  })
);

const valuedTiles: ValuedTile[] = reactive([]);

const emit = defineEmits<{
  (e: "change", state: ValuedTile[]): void;
}>();

watch(
  () => [...valuedTiles],
  () => emit("change", valuedTiles)
);

const score = ref(0);

const isGameOver = ref(false);

const isGameWon = ref(false);

const emptyTiles = computed(() => {
  const isEmpty = (tile: Tile) =>
    !valuedTiles.some((valued) => valued.x === tile.x && valued.y === tile.y);
  return matrix.flat().filter(isEmpty);
});

function newGame() {
  isGameOver.value = false;
  isGameWon.value = false;
  valuedTiles.splice(0, valuedTiles.length);
  score.value = 0;
  spawnRandomTile();
  spawnRandomTile();
}

function spawnRandomTile() {
  const arr = emptyTiles.value;

  const randomTile = arr[Math.floor(Math.random() * arr.length)];

  const valuedTile = new ValuedTile(randomTile);

  valuedTiles.push(valuedTile);
}

function checkGameOver() {
  const isFulled = emptyTiles.value.length === 0;

  if (isFulled) {
    const neighbors = valuedTiles.map((tile) => {
      return {
        tile,
        upNeighbor: findNeighbor("up", tile, valuedTiles),
        downNeighbor: findNeighbor("down", tile, valuedTiles),
        rightNeighbor: findNeighbor("right", tile, valuedTiles),
        leftNeighbor: findNeighbor("left", tile, valuedTiles),
      };
    });

    const someTileCanMove = neighbors.some((e) => {
      return (
        e.tile.value === e.upNeighbor?.value ||
        e.tile.value === e.downNeighbor?.value ||
        e.tile.value === e.rightNeighbor?.value ||
        e.tile.value === e.leftNeighbor?.value
      );
    });

    if (!someTileCanMove) {
      isGameOver.value = true;
    }
  }
}

function findNeighbor<T extends Tile>(
  direction: Direction,
  tile: T,
  inArray: T[]
) {
  let pointer = 1;

  const byDirection = () => {
    switch (direction) {
      case "up":
        return {
          searchFn: (t: T) => t.x === tile.x && t.y === tile.y - pointer,
          condition: () => tile.y - pointer++ > 0,
        };
      case "right":
        return {
          searchFn: (t: T) => t.y === tile.y && t.x === tile.x + pointer,
          condition: () => tile.x + pointer++ < props.size,
        };
      case "down":
        return {
          searchFn: (t: T) => t.x === tile.x && t.y === tile.y + pointer,
          condition: () => tile.y + pointer++ < props.size,
        };
      case "left":
        return {
          searchFn: (t: T) => t.y === tile.y && t.x === tile.x - pointer,
          condition: () => tile.x - pointer++ > 0,
        };
    }
  };

  const result = byDirection();

  let neighbor = inArray.find(result.searchFn);

  while (!neighbor && result.condition())
    neighbor = inArray.find(result.searchFn);

  return neighbor;
}

function move(direction: Direction) {
  function defineSort(a: ValuedTile, b: ValuedTile): number {
    switch (direction) {
      case "up":
        return a.y - b.y;
      case "right":
        return b.x - a.x;
      case "down":
        return b.y - a.y;
      case "left":
        return a.x - b.x;
    }
  }

  const tilesMoving = valuedTiles
    .sort(defineSort)
    .map((tile) => new MovingTile(tile));

  tilesMoving.forEach((tile) => {
    const neighbor = findNeighbor(direction, tile, tilesMoving);

    const shouldMerge = () =>
      neighbor &&
      neighbor.value === tile.value &&
      (neighbor.to === direction || !neighbor.to);

    tile.to = shouldMerge() ? neighbor : direction;
  });

  return applyTiles(direction, tilesMoving);
}

function pulse(id: string) {
  const keyframes: Keyframe[] = [
    { transform: "scale(1)" },
    { transform: "scale(1.2)" },
    { transform: "scale(1)" },
  ];

  const options: KeyframeAnimationOptions = {
    easing: "ease-in-out",
    duration: transitionTime * 2,
    delay: transitionTime / 2,
  };

  document.getElementById(id)!.animate(keyframes, options);
}

function applyTiles(direction: Direction, tiles: MovingTile[]) {
  const moves: any[] = [];

  const byAction = groupBy(tiles, (a) =>
    a.to instanceof MovingTile ? "merging" : "moving"
  );

  byAction.merging?.forEach((tile) => {
    const final = tile.to as MovingTile;
    const realTile = valuedTiles.find((t) => tile.id === t.id);

    if (!realTile) throw new Error(`Tile ${tile.id} not found in valuedTiles`);

    realTile.x = final.x;
    realTile.y = final.y;

    const el = document.getElementById(tile.id);
    el?.setAttribute("data-merge-into", final.id);

    const finalTile = valuedTiles.find((t) => final.id === t.id)!;
    finalTile.value *= 2;
    score.value += finalTile.value;

    if (finalTile.value === 2048) isGameWon.value = true;

    moves.push(finalTile);
    remove(valuedTiles, (t) => t.id === realTile.id);

    pulse(final.id);
  });

  byAction.moving?.forEach((tile) => {
    const neighbor = findNeighbor(tile.to as Direction, tile, valuedTiles);
    const realTile = valuedTiles.find((t) => tile.id === t.id);

    const byDirection = () => {
      switch (direction) {
        case "up":
          return {
            condition: neighbor && neighbor.y + 1 !== realTile!.y,
            cornerCondition: realTile!.y !== 0,
            action: () => (realTile!.y = neighbor!.y + 1),
            goToCorner: () => (realTile!.y = 0),
          };
        case "right":
          return {
            condition: neighbor && neighbor.x - 1 !== realTile!.x,
            cornerCondition: realTile!.x !== props.size - 1,
            action: () => (realTile!.x = neighbor!.x - 1),
            goToCorner: () => (realTile!.x = props.size - 1),
          };
        case "down":
          return {
            condition: neighbor && neighbor.y - 1 !== realTile!.y,
            cornerCondition: realTile!.y !== props.size - 1,
            action: () => (realTile!.y = neighbor!.y - 1),
            goToCorner: () => (realTile!.y = props.size - 1),
          };

        case "left":
          return {
            condition: neighbor && neighbor.x + 1 !== realTile!.x,
            cornerCondition: realTile!.x !== 0,
            action: () => (realTile!.x = neighbor!.x + 1),
            goToCorner: () => (realTile!.x = 0),
          };
      }
    };

    const result = byDirection();

    if (result.condition) {
      result.action();
      moves.push(realTile);
    }

    if (!neighbor && result.cornerCondition) {
      moves.push(realTile);
      result.goToCorner();
    }
  });

  return moves.length > 0;
}

onMounted(() => {
  const board = document.getElementById("board")!;
  console.log(board);
  let ts_x: number, ts_y: number;
  board.addEventListener("touchstart", function (e) {
    if (isGameOver.value || isGameWon.value) return;
    e.preventDefault();
    ts_x = e.touches[0].clientX;
    ts_y = e.touches[0].clientY;
  });
  board.addEventListener("touchend", (e) => {
    if (isGameOver.value || isGameWon.value) return;
    e.preventDefault();
    var td_x = e.changedTouches[0].clientX - ts_x;
    var td_y = e.changedTouches[0].clientY - ts_y;
    let valid = false;
    if (Math.abs(td_x) > Math.abs(td_y)) {
      // horizontal
      if (td_x < 0) {
        valid = move("left");
      } else {
        valid = move("right");
      }
    } else {
      // vertical
      if (td_y < 0) {
        valid = move("up");
      } else {
        valid = move("down");
      }
    }

    if (valid) {
      spawnRandomTile();
    } else {
      checkGameOver();
    }
  });
  if (props.loadTiles && props.loadTiles.length >= 2) {
    valuedTiles.push(...props.loadTiles);
    checkGameOver();
  } else {
    newGame();
  }
});

defineExpose<Board>({
  score,
  newGame,
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
  const allowedKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

  if (!allowedKeys.includes(event.key)) return;

  event.preventDefault();

  if (isGameOver.value || isGameWon.value) return;

  let valid = false;

  if (event.key === "ArrowLeft") {
    valid = move("left");
  } else if (event.key === "ArrowRight") {
    valid = move("right");
  } else if (event.key === "ArrowUp") {
    valid = move("up");
  } else if (event.key === "ArrowDown") {
    valid = move("down");
  }

  if (valid) {
    spawnRandomTile();
  } else {
    checkGameOver();
  }
});

const styleBoard: CSSProperties = {
  gridTemplateColumns: `repeat(${matrix.length}, 1fr)`,
  gridTemplateRows: `repeat(${matrix.length}, 1fr)`,
};
</script>

<template>
  <div id="board" class="board" :style="styleBoard">
    <template v-for="line in matrix">
      <Cell v-for="tile in line" :key="tile.id" :tile="tile"></Cell>
    </template>
    <TilesTransition :valued-tiles="valuedTiles">
      <ValuedCell
        v-for="tile in valuedTiles"
        :tile="tile"
        :key="tile.id"
      ></ValuedCell>
    </TilesTransition>
    <GameOver class="end" v-if="isGameOver" @tryAgain="newGame" />
    <Win
      class="end"
      v-if="isGameWon"
      @tryAgain="newGame"
      @keep="isGameWon = false"
    />
  </div>
</template>

<style scoped>
.board {
  display: grid;
  gap: 15px;
  background-color: #bbada0;
  padding: 15px;
  border-radius: 6px;
  max-width: 500px;
  width: inherit;
  box-sizing: border-box;
  position: relative;
}

.end {
  z-index: 100000;
}
</style>
