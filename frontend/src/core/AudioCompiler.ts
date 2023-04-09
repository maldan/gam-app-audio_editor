import { NoteFrequency } from '@/core/audio';
import { NumberHelper } from '@/helper/NumberHelper';
import type { IChannel, IInstrument, INote } from '@/store/track';

export class AudioCompiler {
  static compileChannel(channel: IChannel, instrumentList: IInstrument[]) {
    const noteList = channel.noteList;

    const out = [];

    out.length = 60 * 2;

    for (let i = 0; i < noteList.length; i++) {
      const note = noteList[i];
      const instrument = instrumentList.find((x) => x.id === note.instrumentId);
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
          volume: NumberHelper.lerp(instrument.volume[0], instrument.volume[1], i / ll) * (channel.masterVolume / 100),
          dutyCycle: dc,
        };
      }

      // Change pitch
      for (let i = 0; i <= ll; i++) {
        out[position + i].frequency *= NumberHelper.lerp(instrument.pitch[0], instrument.pitch[1], i / ll);
      }
    }
  }
}
