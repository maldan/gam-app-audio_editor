<template>
  <div :class="$style.main">
    <div
      @click="selectChannel(x)"
      :class="[$style.channel, x.id === trackStore.currentChannel?.id ? $style.selected : null]"
      v-for="x in trackStore.currentPattern.channelList"
      :key="x.id"
    >
      Ch #{{ x.id }} {{ x.name }}
    </div>
    <button @click="createChannel()">Add</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { IChannel, IInstrument, INote } from '@/store/track';
import { useTrackStore } from '@/store/track';

// Stores
const trackStore = useTrackStore();

// Vars

// Hooks
onMounted(() => {});

// Methods
function selectChannel(x: IChannel) {
  trackStore.currentChannel = x;
}

function createChannel() {
  const pattern = trackStore.currentPattern;
  if (!pattern) return;

  pattern.channelList.push({
    id: pattern.channelList.length,
    name: 'sas',
    noteList: [],
    masterVolume: 50,
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
