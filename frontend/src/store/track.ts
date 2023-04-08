import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';

export interface INote {
  id: string;
  octave: number;
  note: number;
  position: number;
  length: number;
}

export interface ITrackStore {
  noteList: INote[];
}

export const useTrackStore = defineStore({
  id: 'track',
  state: () =>
    ({
      noteList: [],
    } as ITrackStore),
  actions: {
    removeNote(id: string) {
      this.noteList = this.noteList.filter((x) => x.id !== id);
    },
  },
});
