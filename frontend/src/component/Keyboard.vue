<template>
  <div :class="$style.main">
    <div :class="[$style.key, x.length > 1 ? $style.dark : null]" v-for="x in keys" :key="x">{{ x }}{{ octave }}</div>
  </div>
</template>

<script setup lang="ts">
// Stores

// Vars
const props = defineProps<{
  octave: number;
}>();
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].reverse();

// Hooks

// Methods
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  margin-bottom: 2px;

  .key {
    box-sizing: border-box;
    display: flex;
    align-items: center;

    height: 20px;
    padding: 3px;
    width: 64px;
    background-color: #cbcbcb;
    color: #1b1b1b;
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.9);

    &.dark {
      background-color: #6a6a6a;
      color: #cbcbcb;
    }
  }
}
</style>
