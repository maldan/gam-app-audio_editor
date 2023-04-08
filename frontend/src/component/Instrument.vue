<template>
  <div :class="$style.main">
    <div :class="$style.header">Instrument</div>

    <!-- Info -->
    <div>{{ trackStore.currentInstrument.name }}</div>
    <div>WaveType: <input type="number" v-model="trackStore.currentInstrument.waveType" /></div>
    <div>Color: <input type="text" v-model="trackStore.currentInstrument.color" /></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { IInstrument, INote } from '@/store/track';
import { useTrackStore } from '@/store/track';

// Stores
const trackStore = useTrackStore();

// Vars

// Hooks
onMounted(() => {});

// Methods
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  margin-bottom: 2px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;

  .header {
    margin-bottom: 5px;
  }

  .instrument {
    cursor: pointer;
    padding: 5px;
    margin-bottom: 5px;
    background-color: rgba(0, 0, 0, 0.4);

    &.selected {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }

  button {
    cursor: pointer;
    border: 0;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
