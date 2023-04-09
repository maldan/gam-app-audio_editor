<template>
  <div :class="$style.main">
    <div
      @click="selectPattern(x)"
      :class="[$style.channel, x.id === trackStore.currentPattern?.id ? $style.selected : null]"
      v-for="x in trackStore.patternList"
      :key="x.id"
    >
      {{ x.name }}
    </div>
    <button @click="createPattern()">Add</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { IChannel, IInstrument, INote, IPattern } from '@/store/track';
import { useTrackStore } from '@/store/track';

// Stores
const trackStore = useTrackStore();

// Vars

// Hooks
onMounted(() => {});

// Methods
function selectPattern(x: IPattern) {
  trackStore.currentPattern = x;
}
function createPattern() {
  trackStore.patternList.push({
    id: Math.random() + '',
    name: 'sas',
    channelList: [],
  });
}
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  position: relative;

  .channel {
    cursor: pointer;
    padding: 5px;
    margin-bottom: 5px;
    background-color: rgba(0, 0, 0, 0.25);

    &.selected {
      background-color: rgba(255, 255, 255, 0.25);
    }
  }
}
</style>
