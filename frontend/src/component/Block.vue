<template>
  <div :class="$style.main">
    <div :class="$style.header">{{ title }}</div>
    <div :class="$style.body"><slot /></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { IInstrument, INote } from '@/store/track';
import { useTrackStore } from '@/store/track';

// Stores

// Vars
const props = defineProps<{ title: string }>();

// Hooks
onMounted(() => {});

// Methods
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  position: relative;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin-bottom: 10px;

  .header {
    margin-bottom: 5px;
  }
}
</style>
