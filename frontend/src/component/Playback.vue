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
  const currentPattern = trackStore.currentPattern;
  if (!currentPattern) return;

  const actionList = [];

  for (let i = 0; i < currentPattern.channelList.length; i++) {
    const channel = currentPattern.channelList[i];
    if (channel.isMuted) {
      actionList.push([]);
      continue;
    }
    actionList.push(AudioCompiler.compileChannel(trackStore.currentPattern, channel, trackStore.instrumentList));
  }

  trackStore.currentPosition = 0;
  clearInterval(intervalId);

  const max = Math.max(...actionList.map((x) => x.length));
  const finalList: any[] = [];
  for (let i = 0; i < max; i++) {
    const out: any = {
      channel: [],
    };

    for (let j = 0; j < actionList.length; j++) {
      out.channel.push({ id: j, data: actionList[j][i] || {} });
    }

    finalList.push(out);
  }

  intervalId = setInterval(() => {
    // Action list
    if (finalList[~~trackStore.currentPosition]) {
      MegaAudio.sendData(finalList[~~trackStore.currentPosition]);
    }

    trackStore.currentPosition += trackStore.currentPattern?.speed ?? 1;
    if (trackStore.currentPosition > finalList.length - 1) {
      trackStore.currentPosition = 0;
      clearInterval(intervalId);
      stop();
      return;
    }

    mainStore.drawWave(MegaAudio.capture());
  }, 16);
}

function stop() {
  MegaAudio.sendData({
    channel: [
      {
        id: 0,
        data: {
          setVolume: 0,
        },
      },
      {
        id: 1,
        data: {
          setVolume: 0,
        },
      },
    ],
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
