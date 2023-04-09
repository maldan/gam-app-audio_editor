import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';

export interface IMainStore {
  drawWave: (a: Uint8Array) => void;
}

export const useMainStore = defineStore({
  id: 'main',
  state: () =>
    ({
      drawWave: () => {},
    } as IMainStore),
  actions: {},
});
