<template>
  <div @contextmenu.prevent="" :class="$style.main">
    <div
      @click="setNote($event, 11 - i)"
      :class="[$style.key, x.length > 1 ? $style.dark : null]"
      :style="{ width: 256 * size + 'px', height: NoteHeight + 'px' }"
      v-for="(x, i) in keys"
      :key="x"
    ></div>

    <!-- Lines -->
    <div v-for="x in size * 16" :key="x" :class="$style.line" :style="{ left: x * 16 + 'px' }"></div>
    <div v-for="x in size * 4" :key="x" :class="$style.line" :style="{ left: x * 64 + 'px' }"></div>
    <div v-for="x in size" :key="x" :class="$style.line" :style="{ left: x * 256 + 'px' }"></div>

    <!-- Notes -->
    <div
      @contextmenu.prevent="deleteNote(x)"
      @wheel.prevent="resizeNote($event, x)"
      @click.stop="selectNote(x)"
      :class="[$style.note, trackStore.selectedNotes.includes(x) ? $style.selected : null]"
      v-for="x in noteList"
      :style="{
        background: trackStore.instrumentList.find((instrument) => instrument.id === x.instrumentId)?.color,
        left: x.position * 256 + 'px',
        top: (11 - x.note) * NoteHeight + 2 + 'px',
        width: x.length * 256 + 'px',
        height: NoteHeight - 4 + 'px',
      }"
      :key="x"
    >
      {{ keys[11 - x.note] }}{{ x.octave }}
    </div>

    <!-- Ghost notes -->
    <div
      :class="[$style.note, trackStore.selectedNotes.includes(x) ? $style.selected : null]"
      v-for="x in ghostNoteList"
      :style="{
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.2)',
        left: x.position * 256 + 'px',
        top: (11 - x.note) * NoteHeight + 2 + 'px',
        width: x.length * 256 + 'px',
        height: NoteHeight - 4 + 'px',
        pointerEvents: 'none',
      }"
      :key="x"
    >
      {{ keys[11 - x.note] }}{{ x.octave }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { INote } from '@/store/track';
import { useTrackStore } from '@/store/track';
import { NoteHeight, NoteSmallestSection } from '@/const';

// Stores
const trackStore = useTrackStore();

// Vars
const props = defineProps<{
  octave: number;
}>();
const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].reverse();
const noteList = computed(() => {
  const channel = trackStore.currentChannel;
  if (!channel) return;
  return channel.noteList.filter((x) => x.octave === props.octave);
});

const ghostNoteList = computed(() => {
  const pattern = trackStore.currentPattern;
  if (!pattern) return;
  const out: any[] = [];
  pattern.channelList.forEach((channel) => {
    if (channel === trackStore.currentChannel) return;
    if (channel.isMuted) return;
    out.push(...channel.noteList.filter((x) => x.octave === props.octave));
  });
  return out;
});

const size = computed(() => {
  return trackStore.currentPattern?.length || 1;
});

// Hooks
onMounted(() => {});

// Methods
function setNote(e: MouseEvent, note: number) {
  if (!trackStore.currentInstrument) return;
  const channel = trackStore.currentChannel;
  if (!channel) return;

  const t = e.target as HTMLDivElement;
  let position = (e.pageX - t.getBoundingClientRect().x) / 256;
  position = Math.floor(position / NoteSmallestSection) * NoteSmallestSection;

  channel.noteList.push({
    id: Math.random() + 'x',
    instrumentId: trackStore.currentInstrument.id,
    octave: props.octave,
    note,
    position,
    length: trackStore.currentNoteSize,
  });
}

function resizeNote(e: WheelEvent, note: INote) {
  if (e.deltaY < 0) {
    note.length += NoteSmallestSection;
  } else {
    note.length -= NoteSmallestSection;
    if (note.length < NoteSmallestSection) {
      note.length = NoteSmallestSection;
    }
  }
}

function deleteNote(note: INote) {
  trackStore.removeNote(note.id);
}

function selectNote(note: INote) {
  trackStore.selectedNotes.length = 0;
  trackStore.selectedNotes.push(note);
  trackStore.currentNoteSize = note.length;
  trackStore.currentInstrument = trackStore.instrumentList.find((x) => x.id === note.instrumentId);
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
    font-size: 12px;
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
    pointer-events: none;
  }

  .note {
    background-color: #3fb868;
    border-radius: 4px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;
    cursor: pointer;
    border: 1px solid transparent;
    padding-left: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    overflow: hidden;
    text-shadow: 1px -1px 1px black;

    &.selected {
      border: 1px solid #fefefe;
    }

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
