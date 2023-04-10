class NumberHelper {
  static lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }
}

class MyAudioProcessor extends AudioWorkletProcessor {
  sex = 0;
  echoBuffer = [];
  echoBuffer2 = [];
  echoId = 0;
  echoMode = 0;

  constructor() {
    super();

    this.port.onmessage = this.onmessage.bind(this);
    this.phase = 0;
    this.echoBuffer = new Float32Array(8192);
    this.echoBuffer2 = new Float32Array(8192);
  }

  async onmessage(e) {
    if (e.data.type === "init") {
      eval(e.data.synthText);
      this.ch0 = new AudioChannel(e.data.sampleRate);
    }
    if (e.data.type === "setChannelData") {
      if (e.data.setFrequency !== undefined)
        this.ch0.newFrequency = e.data.setFrequency;
      if (e.data.setVolume !== undefined) this.ch0.newVolume = e.data.setVolume;
      if (e.data.setWaveType !== undefined)
        this.ch0.waveType = e.data.setWaveType;
      if (e.data.setDutyCycle !== undefined)
        this.ch0.dutyCycle = e.data.setDutyCycle;
    }
  }

  process(inputList, outputList, parameters) {
    const output = outputList[0];
    const channel = output[0];

    let echoBuffer = this.echoBuffer2;
    if (this.echoMode === 1) echoBuffer = this.echoBuffer;

    for (let i = 0; i < channel.length; ++i) {
      channel[i] = this.ch0.do(this.phase) + this.echoBuffer[this.echoId];
      //channel[i] = this.ch0.do(this.phase);

      // Add echo
      if (this.echoMode === 0) {
        this.echoBuffer[this.echoId] = channel[i] * 0.35;
        this.echoId += 1;
        if (this.echoId > this.echoBuffer.length - 1) {
          this.echoId = 0;
          this.echoMode = 1;
        }
      } else {
        this.echoBuffer2[this.echoId] = channel[i] * 0.35;
        this.echoId += 1;
        if (this.echoId > this.echoBuffer2.length - 1) {
          this.echoId = 0;
          this.echoMode = 0;
        }
      }

      this.phase += 1;
      this.phase += this.ch0.phaseOffset;
      this.ch0.phaseOffset = 0;
      this.ch0.volume = NumberHelper.lerp(
        this.ch0.volume,
        this.ch0.newVolume,
        i / channel.length
      );
    }

    return true;
  }
}

registerProcessor("my-audio-processor", MyAudioProcessor);
