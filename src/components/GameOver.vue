<script lang="ts" setup>
const emit = defineEmits<{ (e: "tryAgain"): void }>();
</script>

<template>
  <div>
    <h1>Game over!</h1>
    <button @click.prevent="emit('tryAgain')">Try again</button>
  </div>
</template>

<style scoped>
div {
  background-color: rgba(238, 228, 218, 0.73);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex-direction: column;
}

h1 {
  font-size: 60px;
  margin-bottom: 40px;
  font-weight: bold;
}
</style>
