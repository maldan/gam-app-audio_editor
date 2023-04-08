import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';
import { NoteFrequency } from '@/core/audio';
import { NumberHelper } from '@/helper/NumberHelper';

export interface INote {
  id: string;
  instrumentName: string;
  octave: number;
  note: number;
  position: number;
  length: number;
}

export interface IInstrument {
  name: string;
  color: string;
  waveType: number;
  volume: number[];
  pitch: number[];
  dutyCycle: number[];
}

export interface ITrackStore {
  noteList: INote[];
  instrumentList: IInstrument[];
  currentInstrument?: IInstrument;
  selectedNotes: INote[];
  currentNoteSize: number;
  masterSound: number;
}

export const useTrackStore = defineStore({
  id: 'track',
  state: () =>
    ({
      noteList: [],
      instrumentList: [],
      currentInstrument: undefined,
      selectedNotes: [],
      currentNoteSize: 0.25,
      masterSound: 50,
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
        const instrument = this.instrumentList.find((x) => x.name === note.instrumentName);
        if (!instrument) continue;

        const position = ~~(note.position * 60);
        const frequency = NoteFrequency[note.octave * 12 + note.note];
        out[position] = {
          frequency,
          waveType: instrument.waveType,
          volume: instrument.volume[0],
        };

        // Change volume
        const ll = note.length * 60;
        for (let i = 0; i <= ll; i++) {
          let dc = NumberHelper.lerp(instrument.dutyCycle[0], instrument.dutyCycle[1], i / ll);
          dc = Math.floor(dc / 0.25) * 0.25;
          out[position + i] = {
            frequency,
            waveType: instrument.waveType,
            volume: NumberHelper.lerp(instrument.volume[0], instrument.volume[1], i / ll) * (this.masterSound / 100),
            dutyCycle: dc,
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
