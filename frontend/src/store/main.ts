import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';
import type { IInstrument, IPattern } from '@/store/track';

export interface IProject {
  name: string;
  patternList: IPattern[];
  instrumentList: IInstrument[];
}

export interface IMainStore {
  drawWave: (a: Uint8Array) => void;
  projectList: IProject[];
}

export const useMainStore = defineStore({
  id: 'main',
  state: () =>
    ({
      drawWave: () => {},
      projectList: [],
    } as IMainStore),
  actions: {
    async get(name: string): Promise<IProject> {
      return (await Axios.get(`${API_URL}/project/index?name=${name}`)).data;
    },
    async getList() {
      this.projectList = await Axios.get(`${API_URL}/project/list`);
    },
    async save(name: string, body: any) {
      await Axios.post(`${API_URL}/project/index`, {
        name,
        body: JSON.stringify(body),
      });
    },
  },
});
