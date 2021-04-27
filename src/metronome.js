const Constants = require('./constants');
audio_utils = require('./audio-utils');

INITIAL_BUFFER_TIME = Constants.METRONOME.INITIAL_BUFFER_TIME;
MET_TICK_HIGH_PATH = Constants.METRONOME.MET_TICK_HIGH_PATH
MET_TICK_LOW_PATH = Constants.METRONOME.MET_TICK_LOW_PATH;
VISUAL_TRANSITION_TIME = Constants.GENERAL.TRANSITION_TIME;

getFile = audio_utils.getFile;
playSample = audio_utils.playSample;


async function getTickSamples(audioContext) {
  const tick_high = await getFile(audioContext, MET_TICK_HIGH_PATH)
  const tick_low = await getFile(audioContext, MET_TICK_LOW_PATH);
  return [tick_high, tick_low];
};

const Metronome = function(count_in_beats, main_beats, beats_per_bar, bpm, audioContext,
                          on_up_tick=null, callback_time_resolution=50, offset_ahead_of_tick=VISUAL_TRANSITION_TIME) {
  this.bpm = bpm;
  this.beat_period = 60.0 / bpm;
  this.bar_period = this.beat_period * beats_per_bar;
  this.count_in_beats = count_in_beats;
  this.main_beats = main_beats;
  this.beats_per_bar = beats_per_bar;
  this.queued_samples = [];

  this.audioContext = audioContext;
  this.on_up_tick = on_up_tick;
  this.callback_initial_time_offset = count_in_beats * this.beat_period;
  this.offset_ahead_of_tick = offset_ahead_of_tick;
  this.callback_time_resolution = callback_time_resolution
  this.callback_calls = 0;
  this.total_num_callback_calls = Math.floor(main_beats / beats_per_bar);
  this.callback_start_time = null;
  this.callback_setinterval_ref = null;
};

Metronome.prototype.step_callback = function() {
  let curr_time = this.audioContext.currentTime;
  let delta_t = curr_time - this.callback_start_time;
  if (delta_t > 0) {
    let expected_num_callbacks = Math.floor(delta_t / this.bar_period);
    let outstanding_callbacks = expected_num_callbacks - this.callback_calls;
    for (let i=0; i < outstanding_callbacks; i++) {
      this.on_up_tick();
      this.callback_calls++;
      if (this.callback_calls >= this.total_num_callback_calls) {
        clearInterval(this.callback_setinterval_ref);
        break;
      }
    }
  }
}

Metronome.prototype.start = function() {
  let context = this.audioContext;
  context.resume().then(() => {
    getTickSamples(context).then(([tick_high, tick_low]) => {
      let ref_time = context.currentTime + INITIAL_BUFFER_TIME;
      let total_beats = this.count_in_beats + this.main_beats;
      for (let i = 0; i < total_beats; i++) {
        let start_time = ref_time + i * this.beat_period;
        // console.log(`${ref_time} + ${i} * ${this.beat_period} + ${INITIAL_BUFFER_TIME} = ${start_time}`);
        let sample_source = playSample(context,
          i % this.beats_per_bar === 0
          ? tick_high
          : tick_low,
          start_time);
        this.queued_samples.push(sample_source);
      }

      // Setup callback
      if (this.on_up_tick !== null) {
        this.callback_start_time = ref_time + this.callback_initial_time_offset - this.offset_ahead_of_tick;
        this.callback_setinterval_ref = setInterval(this.step_callback.bind(this), this.callback_time_resolution);
      }
    });
  });
};

Metronome.prototype.stop = function() {
  for (sample_source of this.queued_samples) {
    sample_source.stop();
  };
  clearInterval(this.callback_setinterval_ref);
};

module.exports.Metronome = Metronome;