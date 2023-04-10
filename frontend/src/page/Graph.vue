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

// Hooks
onMounted(async () => {
  let arr = [];
  let x = 0;
  for (let i = 0; i < 348; i++) {
    arr.push(doSin(phase));
    phase += 1;
  }
  freq = 493.88;

  for (let i = 0; i < 128; i++) {
    arr.push(doSin(phase));
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
