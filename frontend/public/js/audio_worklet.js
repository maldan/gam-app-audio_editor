class NumberHelper {
  static lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
}

class MyAudioProcessor extends AudioWorkletProcessor {
  sex = 0;

  constructor() {
    super();

    this.port.onmessage = this.onmessage.bind(this);
    this.phase = 0;
  }

  async onmessage(e) {
    if (e.data.type === "init") {
      eval(e.data.synthText);
      this.ch0 = new AudioChannel(e.data.sampleRate);
    }
    if (e.data.type === "setChannelData") {
      if (e.data.setFrequency !== undefined)
        this.ch0.frequency = e.data.setFrequency;
      if (e.data.setVolume !== undefined) this.ch0.volume = e.data.setVolume;
      if (e.data.setWaveType !== undefined)
        this.ch0.waveType = e.data.setWaveType;
      if (e.data.setDutyCycle !== undefined)
        this.ch0.dutyCycle = e.data.setDutyCycle;
    }
  }

  process(inputList, outputList, parameters) {
    const output = outputList[0];
    const channel = output[0];
    const isGayMode = this.ch0.frequency !== this.ch0.realFrequency;

    for (let i = 0; i < channel.length; ++i) {
      /*if (isGayMode) {
        this.ch0.realFrequency = NumberHelper.lerp(
          this.ch0.frequency,
          this.ch0.realFrequency,
          i / channel.length
        );
      }*/
      channel[i] = this.ch0.do(this.phase);
      this.phase += 1;
      if (isGayMode) {
        channel[i] *= 0;
      }
    }

    if (this.ch0.frequency !== this.ch0.realFrequency) {
      this.ch0.realFrequency = this.ch0.frequency;
    }

    return true;
  }
}

registerProcessor("my-audio-processor", MyAudioProcessor);
