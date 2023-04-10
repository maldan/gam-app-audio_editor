import { NoteFrequency } from '@/core/audio';
import { NumberHelper } from '@/helper/NumberHelper';
import type { IChannel, IInstrument, INote, IPattern } from '@/store/track';

export interface AudioCommand {
  setFrequency?: number;
  setVolume?: number;
  setWaveType?: number;
  setDutyCycle?: number;
}

export class AudioCompiler {
  static compileChannel(pattern: IPattern, channel: IChannel, instrumentList: IInstrument[]): AudioCommand[] {
    const noteList = channel.noteList.sort((a, b) => a.position - b.position);
    console.log(noteList);

    const out: AudioCommand[] = [];
    out.length = 60 * pattern.length;

    for (let i = 0; i < out.length; i++) {
      out[i] = { setVolume: 0 };
    }

    for (let i = 0; i < noteList.length; i++) {
      const note = noteList[i];
      const instrument = instrumentList.find((x) => x.id === note.instrumentId);
      if (!instrument) continue;

      const position = ~~(note.position * 60);
      const noteId = note.octave * 12 + note.note;
      const frequency = NoteFrequency[noteId];
      const noteLength = ~~(note.length * 60);
      const masterVolume = channel.masterVolume / 100;

      for (let j = 0; j <= noteLength; j++) {
        const noteProgress = j / noteLength;
        const time = note.position * 60 + j;

        out[position + j] = {
          setFrequency: frequency,
          setWaveType: instrument.waveType,
          setVolume: masterVolume,
        };

        // Volume script
        if (instrument.volumeScript) {
          const fn = eval(`(progress, time) => {
              let out = 0;
              ${instrument.volumeScript}
              return out;
          }`);
          out[position + j].setVolume = (fn(noteProgress, time) ?? 0) * masterVolume;
        }

        // DutyCycle script
        if (instrument.dutyScript) {
          const dutyFn = eval(`(progress, time) => {
              let out = 0;
              ${instrument.dutyScript}
              return out;
          }`);
          out[position + j].setDutyCycle = dutyFn(noteProgress, time) ?? 0;
        }

        // Pitch script
        if (instrument.pitchScript) {
          const fn = eval(`(progress, time) => {
              let out = 0;
              ${instrument.pitchScript}
              return out;
          }`);
          // @ts-ignore
          out[position + j].setFrequency *= fn(noteProgress, time) ?? 0;
        }

        // Arpeggio script
        if (instrument.arpeggioScript) {
          const fn = eval(`(progress, time) => {
              let out = 0;
              ${instrument.arpeggioScript}
              return out;
          }`);
          // @ts-ignore
          out[position + j].setFrequency = NoteFrequency[noteId + ~~fn(noteProgress, time)];
        }
      }

      // Set volume 0
      /*console.log(position, noteLength);
      for (let j = 0; j < 1; j++) {
        if (!out[position + noteLength + j]) out[position + noteLength + j] = { setVolume: 0 };
        out[position + noteLength + j].setVolume = 0;
      }*/
    }

    console.log(out);

    return out;
  }
}
