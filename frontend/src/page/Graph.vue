<template>
  <div :class="$style.main">
    <LineChart :chartData="testData" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTrackStore } from '@/store/track';
import { useMainStore } from '@/store/main';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Stores
const trackStore = useTrackStore();
const mainStore = useMainStore();

// Vars
const testData = ref<any>({
  labels: [],
  datasets: [
    {
      data: [],
    },
  ],
});
let freq = 261.63;
let freq2 = 261.63;
let phase = 0;
let lastV = 0;
let sampleRate = 44_100;

// Hooks
onMounted(async () => {
  let arr = [];
  let x = 0;
  for (let i = 0; i < 348; i++) {
    arr.push(saw(phase));
    phase += 1;
  }
  freq2 = 800;

  for (let i = 0; i < 348; i++) {
    arr.push(saw(phase));
    phase += 1;
  }

  drawChart(arr);
});

// Methods
function drawChart(arr: any[]) {
  testData.value.labels = [...arr].map((x, i) => i.toFixed(4));
  testData.value.datasets[0].data = [...arr];
}

function doSin(t: number): number {
  let v = Math.sin(2 * Math.PI * freq2 * (t / 44100));
  let isUp = v > lastV;

  if (freq != freq2) {
    if (Math.abs(v) < 0.1) {
      freq2 = freq;

      // Find next phase
      for (let i = 0; i < 4096; i++) {
        let v2 = Math.sin(2 * Math.PI * freq2 * (phase / 44100));
        let v3 = Math.sin(2 * Math.PI * freq2 * ((phase + 1) / 44100));

        if (v3 > v2 && isUp && Math.abs(v2) < 0.1) {
          break;
        }
        if (v3 < v2 && !isUp && Math.abs(v2) < 0.1) {
          break;
        }

        phase += 1;
      }
    }
  }

  lastV = v;
  return v;
}

function doSquare(t: number): number {
  let x = doSin(t);
  if (x > 0) {
    return 1;
  } else {
    return -1;
  }
}

function triangle(t: number): number {
  let ft = freq2 * (t / 44100);
  return 4 * Math.abs(ft - Math.floor(ft + 1 / 2)) - 1;
}

function saw(t: number): number {
  let f = freq2;
  let tt = t / 44100;
  return 2 * (tt % (1 / f)) * freq2 - 1;
}
</script>

<style module lang="scss">
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
