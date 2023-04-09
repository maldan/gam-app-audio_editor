import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';
import { NoteFrequency } from '@/core/audio';
import { NumberHelper } from '@/helper/NumberHelper';

export interface INote {
  id: string;
  instrumentId: string;
  octave: number;
  note: number;
  position: number;
  length: number;
}

export interface IInstrument {
  id: string;
  name: string;
  color: string;
  waveType: number;

  volumeScript: string;
  dutyScript: string;
  pitchScript: string;
  arpeggioScript: string;
}

export interface ITrackStore {
  patternList: IPattern[];

  currentChannel?: IChannel;
  currentPattern?: IPattern;

  instrumentList: IInstrument[];
  currentInstrument?: IInstrument;
  selectedNotes: INote[];

  currentNoteSize: number;
  currentPosition: number;
}

export interface IChannel {
  id: number;
  name: string;
  noteList: INote[];
  masterVolume: number;
}

export interface IPattern {
  id: string;
  name: string;
  channelList: IChannel[];
  length: number;
}

export const useTrackStore = defineStore({
  id: 'track',
  state: () =>
    ({
      patternList: [],
      instrumentList: [],
      selectedNotes: [],
      currentNoteSize: 0.25,
      currentPosition: 0,
    } as ITrackStore),
  actions: {
    removeNote(id: string) {
      const channel = this.currentChannel;
      if (!channel) return;
      channel.noteList = channel.noteList.filter((x) => x.id !== id);
    },
  },
});
