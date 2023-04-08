<template>
  <div :class="$style.main">
    <button @click="init">Init</button>
    <button @click="play">Play</button>

    <div :class="$style.line" v-for="x in [7, 6, 5, 4, 3, 2]" :key="x">
      <Keyboard :octave="x" />
      <PianoRoll :octave="x" style="margin-left: 2px" />
    </div>

    <!-- Line -->
    <div :class="$style.playLine" :style="{ left: 64 + currentPosition * 4.266666666666667 + 'px' }"></div>
  </div>
</template>

<script setup lang="ts">
import Keyboard from '@/component/Keyboard.vue';
import PianoRoll from '@/component/PianoRoll.vue';
import { onMounted, ref } from 'vue';
import { MegaAudio, NoteFrequency } from '@/core/audio';
import { useTrackStore } from '@/store/track';
import { NoteSmallestSection } from '@/const';

// Stores
const trackStore = useTrackStore();

// Vars
const currentPosition = ref(0);
let intervalId = 0;

// Hooks
onMounted(async () => {
  document.addEventListener('click', () => {
    trackStore.selectedNotes.length = 0;
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      trackStore.selectedNotes.forEach((x) => {
        x.position += NoteSmallestSection;
      });
    }
    if (e.code === 'ArrowLeft') {
      trackStore.selectedNotes.forEach((x) => {
        x.position -= NoteSmallestSection;
      });
    }
  });
});

// Methods
async function init() {
  await MegaAudio.init();
}

function play() {
  const actionList = trackStore.compile();
  currentPosition.value = 0;
  clearInterval(intervalId);
  console.log(actionList);
  intervalId = setInterval(() => {
    // Action list
    if (actionList[currentPosition.value]) {
      MegaAudio.sendData(actionList[currentPosition.value]);
    }

    currentPosition.value += 1;
    if (currentPosition.value > actionList.length - 1) {
      currentPosition.value = 0;
      clearInterval(intervalId);
      return;
    }
  }, 16);
}
</script>

<style module lang="scss">
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  position: relative;

  .line {
    display: flex;
  }

  .playLine {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border: 1px solid #fe0000;
  }
}
</style>
