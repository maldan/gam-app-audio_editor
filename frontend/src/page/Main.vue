<template>
  <div :class="$style.main">
    <button @click="play">Play</button>

    <canvas id="wave" width="1024" height="24" style="width: 1024px; height: 24px"></canvas>

    <!-- Main -->
    <div :class="$style.grid">
      <div :class="$style.pianoRoll">
        <div :class="$style.line" v-for="x in [7, 6, 5, 4, 3, 2]" :key="x">
          <Keyboard :octave="x" />
          <PianoRoll :octave="x" :size="2" />
        </div>
      </div>
      <div>
        <InstrumentList style="margin-bottom: 10px" />
        <Instrument v-if="trackStore.currentInstrument" style="margin-bottom: 10px" />
        <Channel />
      </div>

      <!-- Line -->
      <div :class="$style.playLine" :style="{ left: 64 + currentPosition * 4.266666666666667 + 'px' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Keyboard from '@/component/Keyboard.vue';
import PianoRoll from '@/component/PianoRoll.vue';
import { onMounted, ref } from 'vue';
import { MegaAudio, NoteFrequency } from '@/core/audio';
import { useTrackStore } from '@/store/track';
import { NoteSmallestSection } from '@/const';
import InstrumentList from '@/component/InstrumentList.vue';
import Instrument from '@/component/Instrument.vue';
import Channel from '@/component/Channel.vue';

// Stores
const trackStore = useTrackStore();

// Vars
const currentPosition = ref(0);
let intervalId = 0;
let canvasContext: CanvasRenderingContext2D;

// Hooks
onMounted(async () => {
  document.addEventListener('click', () => {
    trackStore.selectedNotes.length = 0;
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      trackStore.selectedNotes.forEach((x) => {
        x.position += NoteSmallestSection;
      });
    }
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      trackStore.selectedNotes.forEach((x) => {
        x.position -= NoteSmallestSection;
      });
    }
    if (e.code === 'ArrowUp') {
      e.preventDefault();
      trackStore.selectedNotes.forEach((x) => {
        x.note += 1;
        if (x.note > 11) {
          x.note = 0;
          x.octave += 1;
        }
      });
    }
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      trackStore.selectedNotes.forEach((x) => {
        x.note -= 1;
        if (x.note < 0) {
          x.note = 11;
          x.octave -= 1;
        }
      });
    }
  });

  try {
    trackStore.noteList = JSON.parse(localStorage.getItem('notes') || '[]');
  } catch {
    // error
  }

  try {
    trackStore.instrumentList = JSON.parse(localStorage.getItem('instruments') || '[]');
  } catch {
    // error
  }

  initCanvas();
});

// Methods
function initCanvas() {
  const c = document.getElementById('wave') as HTMLCanvasElement;
  canvasContext = c.getContext('2d') as CanvasRenderingContext2D;

  canvasContext.fillStyle = '#ffffff';
  canvasContext.fillRect(0, 0, 1024, 24);
}

function drawWave(arr: Uint8Array) {
  canvasContext.fillRect(0, 0, 1024, 24);

  canvasContext.strokeStyle = '#2b2b2b';
  for (let i = 0; i < arr.length - 1; i++) {
    canvasContext.beginPath();
    canvasContext.moveTo(i, (arr[i] / 255) * 24);
    canvasContext.lineTo(i + 1, (arr[i + 1] / 255) * 24);
    canvasContext.stroke();
  }
}

async function play() {
  if (!MegaAudio._audioContext) {
    await MegaAudio.init();
  }

  const actionList = trackStore.compile();
  currentPosition.value = 0;
  clearInterval(intervalId);
  console.log(actionList);
  intervalId = setInterval(() => {
    // Action list
    if (actionList[~~currentPosition.value]) {
      MegaAudio.sendData(actionList[~~currentPosition.value]);
    }

    currentPosition.value += 0.6;
    if (currentPosition.value > actionList.length - 1) {
      currentPosition.value = 0;
      clearInterval(intervalId);
      return;
    }

    drawWave(MegaAudio.capture());
  }, 16);

  localStorage.setItem('notes', JSON.stringify(trackStore.noteList));
  localStorage.setItem('instruments', JSON.stringify(trackStore.instrumentList));
}
</script>

<style module lang="scss">
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;

  .line {
    display: flex;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    height: calc(100% - 65px);
    position: relative;
    gap: 10px;

    .playLine {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      border: 1px solid #fe0000;
    }

    .pianoRoll {
      height: 100%;
      overflow-y: auto;

      // padding: 10px;
      // background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
