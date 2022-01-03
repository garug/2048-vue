<script lang="ts" setup>
const emit = defineEmits<{ (e: "tryAgain"): void; (e: "keep"): void }>();
</script>

<template>
  <div class="main">
    <h1>You win!</h1>
    <div class="actions">
      <button @click.prevent="emit('keep')">Keep going</button>
      <button @click.prevent="emit('tryAgain')">Try again</button>
    </div>
  </div>
</template>

<style scoped>
.main {
  background-color: rgba(237, 194, 46, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  flex-direction: column;
}

.actions {
  display: flex;
  gap: 8px;
}

h1 {
  font-size: 60px;
  margin-bottom: 40px;
  font-weight: bold;
  color: white;
}
</style>
