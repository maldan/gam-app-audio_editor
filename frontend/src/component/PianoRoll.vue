<template>
  <div @contextmenu.prevent="" :class="$style.main">
    <div
      @click="setNote($event, i)"
      :class="[$style.key, x.length > 1 ? $style.dark : null]"
      :style="{ width: 256 * 4 + 'px' }"
      v-for="(x, i) in keys"
      :key="x"
    ></div>

    <!-- Lines -->
    <div v-for="x in 4 * 4" :key="x" :class="$style.line" :style="{ left: x * 64 + 'px' }"></div>
    <div v-for="x in 4" :key="x" :class="$style.line" :style="{ left: x * 256 + 'px' }"></div>

    <div
      @contextmenu.prevent="deleteNote(x)"
      @wheel.prevent="resizeNote($event, x)"
      :class="$style.note"
      v-for="x in noteList"
      :style="{
        left: x.position * 256 + 'px',
        top: x.note * 20 + 1 + 'px',
        width: x.length * 256 + 'px',
      }"
      :key="x"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { INote } from '@/store/track';
import { useTrackStore } from '@/store/track';

// Stores
const trackStore = useTrackStore();

// Vars
const props = defineProps<{
  octave: number;
}>();
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].reverse();
const noteList = computed(() => {
  return trackStore.noteList.filter((x) => x.octave === props.octave);
});

// Hooks
onMounted(() => {});

// Methods
function setNote(e: MouseEvent, note: number) {
  const t = e.target as HTMLDivElement;
  let position = (e.pageX - t.getBoundingClientRect().x) / 256;
  position = Math.floor(position / 0.25) * 0.25;

  trackStore.noteList.push({
    id: Math.random() + 'x',
    octave: props.octave,
    note,
    position,
    length: 0.25,
  });
}

function resizeNote(e: WheelEvent, note: INote) {
  if (e.deltaY < 0) {
    note.length += 0.25 / 2;
  } else {
    note.length -= 0.25 / 2;
    if (note.length < 0.25 / 2) {
      note.length = 0.25 / 2;
    }
  }
}

function deleteNote(note: INote) {
  trackStore.removeNote(note.id);
}
</script>

<style module lang="scss">
.main {
  display: flex;
  user-select: none;
  flex-direction: column;
  margin-bottom: 2px;
  position: relative;

  .key {
    box-sizing: border-box;
    display: flex;
    align-items: center;

    height: 20px;
    padding: 3px;
    width: 256px;
    background-color: rgba(255, 255, 255, 0.1);
    color: #2b2b2b;
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.9);

    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &.dark {
      background-color: rgba(255, 255, 255, 0.08);
    }
  }

  .line {
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  .note {
    background-color: #3fb868;
    border-radius: 4px;
    height: 15px;
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;

    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
