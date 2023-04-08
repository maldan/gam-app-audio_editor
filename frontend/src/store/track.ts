import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';
import { NoteFrequency } from '@/core/audio';
import { NumberHelper } from '@/helper/NumberHelper';

export interface INote {
  id: string;
  instrument: IInstrument;
  octave: number;
  note: number;
  position: number;
  length: number;
}

export interface IInstrument {
  color: string;
  waveType: number;
  volume: number[];
  pitch: number[];
}

export interface ITrackStore {
  noteList: INote[];
  currentInstrument: IInstrument;
  selectedNotes: INote[];
}

export const useTrackStore = defineStore({
  id: 'track',
  state: () =>
    ({
      noteList: [],
      currentInstrument: {
        color: '#009900',
        waveType: 1,
        volume: [1, 0],
        pitch: [1, 1.025],
      },
      selectedNotes: [],
    } as ITrackStore),
  actions: {
    removeNote(id: string) {
      this.noteList = this.noteList.filter((x) => x.id !== id);
    },
    compile() {
      const out = [];
      out.length = 60 * 4;

      for (let i = 0; i < this.noteList.length; i++) {
        const note = this.noteList[i];
        const position = ~~(note.position * 60);
        const instrument = note.instrument;
        const frequency = NoteFrequency[note.octave * 12 + note.note];
        out[position] = {
          frequency,
          waveType: instrument.waveType,
          volume: note.instrument.volume[0],
        };

        // Change volume
        const ll = note.length * 60;
        for (let i = 0; i <= ll; i++) {
          out[position + i] = {
            frequency,
            waveType: instrument.waveType,
            volume: NumberHelper.lerp(instrument.volume[0], instrument.volume[1], i / ll),
          };
        }

        // Change pitch
        for (let i = 0; i <= ll; i++) {
          out[position + i].frequency *= NumberHelper.lerp(instrument.pitch[0], instrument.pitch[1], i / ll);
        }
      }
      return out;
    },
  },
});
