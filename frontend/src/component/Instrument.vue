<template>
  <div :class="$style.main">
    <div :class="$style.header">Instrument</div>

    <!-- Info -->
    <div>{{ trackStore.currentInstrument.name }}</div>
    <div>WaveType: <input type="number" v-model="trackStore.currentInstrument.waveType" /></div>
    <div>Color: <input type="text" v-model="trackStore.currentInstrument.color" /></div>

    <div :class="$style.tabs">
      <div @click="selectTab(x)" :class="[$style.tab, x === tab ? $style.selected : null]" v-for="x in tabs" :key="x">
        {{ x }}
      </div>
    </div>

    <div v-if="tab === 'volume'">
      <textarea placeholder="Volume script" v-model="trackStore.currentInstrument.volumeScript"></textarea>
    </div>
    <div v-if="tab === 'duty'">
      <textarea placeholder="Duty cycle script" v-model="trackStore.currentInstrument.dutyScript"></textarea>
    </div>
    <div v-if="tab === 'pitch'">
      <textarea placeholder="Pitch script" v-model="trackStore.currentInstrument.pitchScript"></textarea>
    </div>
    <div v-if="tab === 'arpeggio'">
      <textarea placeholder="Arpeggio script" v-model="trackStore.currentInstrument.arpeggioScript"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { IInstrument, INote } from '@/store/track';
import { useTrackStore } from '@/store/track';

// Stores
const trackStore = useTrackStore();

// Vars
const tabs = ['volume', 'duty', 'pitch', 'arpeggio'];
const tab = ref('volume');

// Hooks
onMounted(() => {});

// Methods
function selectTab(x: string) {
  tab.value = x;
}
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
  box-sizing: border-box;

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

  .tabs {
    display: flex;
    margin-top: 10px;

    .tab {
      cursor: pointer;
      padding: 5px 10px;
      flex: 1;
      background-color: rgba(0, 0, 0, 0.4);
      text-align: center;
      margin-bottom: 10px;

      &.selected {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }

  textarea {
    width: calc(100% - 10px);
    background-color: rgba(0, 0, 0, 0.4);
    border: 0;
    color: rgba(255, 255, 255, 0.6);
    min-height: 120px;
    padding: 5px;
    outline: none;
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
