<template>
  <div :class="$style.main">
    <!-- Info -->
    <div>Master volume</div>
    <input type="number" v-model="trackStore.currentChannel.masterVolume" />
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
  position: relative;

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
