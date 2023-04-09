<template>
  <div :class="$style.main">
    <!-- Main -->
    <div :class="$style.grid">
      <!-- Channel list -->
      <div>
        <Block :title="'Pattern list'"><PatternList /></Block>
        <Block v-if="trackStore.currentPattern" :title="'Channel list'"><ChannelList /></Block>
      </div>

      <Block :title="'Pattern'" :style="{ height: maxHeight + 'px' }">
        <div v-if="trackStore.currentChannel" :class="$style.pianoRoll">
          <div :class="$style.line" v-for="x in [7, 6, 5, 4, 3, 2]" :key="x">
            <Keyboard :octave="x" />
            <PianoRoll :octave="x" :size="2" />
          </div>

          <!-- Line -->
          <div
            :class="$style.playLine"
            :style="{ left: 64 + trackStore.currentPosition * 4.266666666666667 + 'px' }"
          ></div>
        </div>
      </Block>

      <div>
        <Block :title="'Instrument List'"><InstrumentList /></Block>
        <Block v-if="trackStore.currentInstrument" :title="'Instrument'"><Instrument /></Block>

        <Block v-if="trackStore.currentChannel" :title="'Current Channel'"><Channel /></Block>
        <Block :title="'Wave Preview'"><WavePreview /></Block>
        <Block :title="'Playback'"><Playback /></Block>
      </div>
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
import Block from '@/component/Block.vue';
import WavePreview from '@/component/WavePreview.vue';
import { useMainStore } from '@/store/main';
import Playback from '@/component/Playback.vue';
import ChannelList from '@/component/ChannelList.vue';
import PatternList from '@/component/PatternList.vue';

// Stores
const trackStore = useTrackStore();
const mainStore = useMainStore();

// Vars
let intervalId = 0;
const maxHeight = ref(200);

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
    const x = JSON.parse(localStorage.getItem('channels') || '[]');
    for (let i = 0; i < x.length; i++) {
      const ch = x[i];
      const channel = trackStore.channelList.find((x) => x.id === ch.id);
      if (!channel) continue;
      channel.noteList = ch.noteList;
    }
  } catch {
    // error
  }

  try {
    trackStore.instrumentList = JSON.parse(localStorage.getItem('instruments') || '[]');
  } catch {
    // error
  }

  maxHeight.value = window.innerHeight - 40;
  window.addEventListener('resize', () => {
    maxHeight.value = window.innerHeight - 40;
  });
});

// Methods
</script>

<style module lang="scss">
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .line {
    display: flex;
  }

  .grid {
    display: grid;
    grid-template-columns: 220px 1fr 280px;
    position: relative;
    gap: 10px;
    height: calc(100% - 20px);
    grid-auto-rows: min-content;

    .playLine {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      border: 1px solid #fe0000;
    }

    .pianoRoll {
      position: relative;
      height: 100%;
      // padding: 10px;
      // background-color: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
