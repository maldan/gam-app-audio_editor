<template>
  <div :class="$style.main">
    <button @click="play">Play</button>
    <button @click="stop">Stop</button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { IInstrument, INote } from '@/store/track';
import { useTrackStore } from '@/store/track';
import { MegaAudio } from '@/core/audio';
import { useMainStore } from '@/store/main';
import { AudioCompiler } from '@/core/AudioCompiler';

// Stores
const trackStore = useTrackStore();
const mainStore = useMainStore();

// Vars
let intervalId = 0;

// Hooks
onMounted(() => {});

// Methods
async function play() {
  if (!trackStore.currentPattern) return;
  if (!trackStore.currentChannel) return;

  if (!MegaAudio._audioContext) {
    await MegaAudio.init();
  }

  const actionList = AudioCompiler.compileChannel(
    trackStore.currentPattern,
    trackStore.currentChannel,
    trackStore.instrumentList,
  );
  trackStore.currentPosition = 0;
  clearInterval(intervalId);

  intervalId = setInterval(() => {
    // Action list
    if (actionList[~~trackStore.currentPosition]) {
      MegaAudio.sendData(actionList[~~trackStore.currentPosition]);
    }

    trackStore.currentPosition += trackStore.currentPattern?.speed ?? 1;
    if (trackStore.currentPosition > actionList.length - 1) {
      trackStore.currentPosition = 0;
      clearInterval(intervalId);
      stop();
      return;
    }

    mainStore.drawWave(MegaAudio.capture());
  }, 16);

  localStorage.setItem('patterns', JSON.stringify(trackStore.patternList));
  localStorage.setItem('instruments', JSON.stringify(trackStore.instrumentList));
}

function stop() {
  MegaAudio.sendData({
    setVolume: 0,
  });
  clearInterval(intervalId);
}
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  position: relative;

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
