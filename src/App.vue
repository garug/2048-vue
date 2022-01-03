<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { KEY_HIGH_SCORE, KEY_STATE } from "./constants";
import { Board as BoardType } from "./types";

import Board from "./components/Board.vue";

const board = ref<BoardType>(undefined as any);

const highScore = computed(() => {
  const value = board.value?.score;
  const localValue = localStorage.getItem(KEY_HIGH_SCORE);

  if (value && localValue) {
    const max = Math.max(value, Number(localValue));

    if (max === value) localStorage.setItem(KEY_HIGH_SCORE, String(value));

    return max;
  } else if (value) {
    localStorage.setItem(KEY_HIGH_SCORE, String(value));
    return value;
  } else if (localValue) {
    return Number(localValue);
  } else {
    return 0;
  }
});

const loadTiles = ref([]);

const prevState = localStorage.getItem(KEY_STATE);

if (prevState) {
  const prevStateParse = JSON.parse(prevState);
  loadTiles.value = prevStateParse.tiles;
  onMounted(() => (board.value.score = prevStateParse.score));
}

function saveState(valuedTiles: any[]) {
  const state = { tiles: valuedTiles, score: board.value.score };
  localStorage.setItem(KEY_STATE, JSON.stringify(state));
}

function howToPlay() {
  const el = document.getElementById("howToPlay")!;
  el.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  el.animate(
    [
      { backgroundColor: "#f3d774", boxShadow: "0 0 0 15px #f3d774" },
      { backgroundColor: "transparent", boxShadow: "0 0 0 10px transparent" },
    ],
    {
      duration: 2000,
      easing: "ease-in",
      iterations: 1,
    }
  );
}
</script>

<template>
  <header>
    <div class="flex mb-2">
      <h1 class="title">2048</h1>
      <div class="infos">
        <div class="info">
          <h2 class="title">Score</h2>
          <p>{{ board?.score }}</p>
        </div>
        <div class="info">
          <h2 class="title">Best</h2>
          <p>{{ highScore }}</p>
        </div>
      </div>
    </div>
    <div class="flex">
      <p>
        Join the tiles, get to <b>2048</b>!<br />
        <a @click="howToPlay">How to play →</a>
      </p>
      <button @click="board.newGame">New Game</button>
    </div>
  </header>

  <main>
    <Board
      class="mb-4"
      :size="4"
      :loadTiles="loadTiles"
      @change="saveState"
      ref="board"
    ></Board>
    <p id="howToPlay">
      <b>HOW TO PLAY:</b> Use your <b>arrow keys</b> to move the tiles. Tiles
      with the same number <b>merge into one</b> when they touch. Add them up to
      reach <b>2048</b>!
    </p>
    <hr />
    <p>
      You’re playing a <b>clone made with vue</b> of 2048. Try out the official
      <a href="https://play2048.co/" target="blank">here</a>.
    </p>
    <hr />
    <p class="align-center">Made with ❤️ by Garug</p>
  </main>
</template>

<style>
@import url("./assets/styles/reset.css");

@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700");

#app {
  font-family: "Open sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #776e65;
  background-color: #faf8ef;
  font-size: 18px;
}

#howToPlay {
  border-radius: 8px;
}

.mb-2 {
  margin-bottom: 16px;
}

.mb-4 {
  margin-bottom: 32px;
}

.align-center {
  text-align: center;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 50px;
  margin: 0;
  font-weight: bold;
}

@media (min-width: 1024px) {
  .title {
    font-size: 80px;
  }
}

.infos {
  display: inline-flex;
  gap: 6px;
  margin-bottom: 8px;
}

.info {
  background-color: #bbada0;
  padding: 8px 24px;
  border-radius: 6px;
}

.info .title {
  font-size: 13px;
  font-weight: bold;
  color: #eee4da;
  text-transform: uppercase;
  text-align: center;
}

.info p {
  color: white;
  font-size: 25px;
  text-align: center;
  font-weight: bold;
}

button {
  background-color: #8f7a66;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  padding: 0 20px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
}

p {
  line-height: 29.75px;
}

a {
  font-weight: bold;
  text-decoration: underline;
  color: #776e65;
  cursor: pointer;
}

header {
  padding: 40px 0;
}

main {
  padding-bottom: 40px;
}

header,
main {
  max-width: 500px;
  padding: 21px;
  margin: 0 auto;
}

b {
  font-weight: bold;
}

hr {
  border: 0;
  height: 1px;
  width: 100%;
  background-color: #d8d4d0;
  margin: 32px 0;
  display: block;
}
</style>
