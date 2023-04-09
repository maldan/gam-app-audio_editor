<template>
  <div :class="$style.main">
    <canvas ref="canvas" height="32" style="width: 100%; height: 32px"></canvas>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { IInstrument, INote } from '@/store/track';
import { useTrackStore } from '@/store/track';
import { useMainStore } from '@/store/main';

// Stores
const trackStore = useTrackStore();
const mainStore = useMainStore();

// Vars
let canvasContext: CanvasRenderingContext2D;
const canvas = ref<HTMLCanvasElement>();

// Hooks
onMounted(() => {
  initCanvas();

  mainStore.drawWave = drawWave;
});

// Methods
function initCanvas() {
  canvasContext = canvas.value?.getContext('2d') as CanvasRenderingContext2D;
  canvasContext.fillStyle = '#003300';
  canvasContext.fillRect(0, 0, canvas.value?.width || 1024, 32);
}

function drawWave(arr: Uint8Array) {
  canvasContext.fillRect(0, 0, canvas.value?.width || 1024, 32);
  canvasContext.strokeStyle = '#009900';

  const len = Math.min(arr.length - 1, canvas.value?.width || 10);

  for (let i = 0; i < len; i++) {
    canvasContext.beginPath();
    canvasContext.moveTo(i, (arr[i] / 255) * 32);
    canvasContext.lineTo(i + 1, (arr[i + 1] / 255) * 32);
    canvasContext.stroke();
  }
}
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  margin-bottom: 2px;
  position: relative;
}
</style>
