<template>
  <div :class="$style.main">
    <div
      @click="selectInstrument(x)"
      :class="[$style.instrument, x.name === trackStore.currentInstrument?.name ? $style.selected : null]"
      v-for="x in trackStore.instrumentList"
      :key="x.name"
    >
      <div :class="$style.icon" :style="{ backgroundColor: x.color }"></div>
      {{ x.name }}
    </div>
    <button @click="addNew">Add new</button>
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
function addNew() {
  trackStore.instrumentList.push({
    id: Math.random() + '',
    name: 'sas ' + Math.random(),
    color: '#fe0000',
    waveType: 1,
    volume: [1, 0],
    pitch: [1, 2],
    dutyCycle: [0, 1],
  });
}

function selectInstrument(x: IInstrument) {
  trackStore.currentInstrument = x;
}
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  position: relative;
  background-color: rgba(0, 0, 0, 0.2);

  .instrument {
    cursor: pointer;
    padding: 5px;
    margin-bottom: 5px;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;

    .icon {
      width: 12px;
      height: 12px;
      margin-right: 5px;
      border-radius: 4px;
    }

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
