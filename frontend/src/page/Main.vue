<template>
  <div :class="$style.main">
    <div :class="$style.line" v-for="x in [4, 3, 2]" :key="x">
      <Keyboard :octave="x" />
      <PianoRoll :octave="x" style="margin-left: 2px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Keyboard from '@/component/Keyboard.vue';
import PianoRoll from '@/component/PianoRoll.vue';
import { onMounted } from 'vue';

// Stores

// Vars

// Hooks
onMounted(() => {});

// Methods
</script>

<style module lang="scss">
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  .line {
    display: flex;
  }
}
</style>
