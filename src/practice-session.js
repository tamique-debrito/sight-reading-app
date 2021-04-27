Metronome = require('./metronome');
renderableBar = require('./renderable-bar');
generateSequence = require('./practice-sequence-generator');

Metronome = Metronome.Metronome;
renderableBar = renderableBar.renderableBar;
generateSequence = generateSequence.generateSequence;


const practiceSession = function(num_bars, shortest_note, count_in_beats, beats_per_bar, bpm, leap_amount, clef_type, renderContext, audioContext,
  voice_length=300, clef_length=350, clef_start_x=20, cleft_start_y=20, clef_y_spacing=160) {
  let bars = generateSequence(num_bars, shortest_note, beats_per_bar, leap_amount, clef_type);
  this.renderable_bars = bars.map((e, i) => new renderableBar(e, clef_type, beats_per_bar, renderContext, voice_length));

  let main_beats = beats_per_bar * num_bars;

  this.num_bars = num_bars;
  this.voice_length = voice_length;
  this.clef_length = clef_length;
  this.metronome = new Metronome(count_in_beats, main_beats, beats_per_bar, bpm, audioContext, this.advance_bars.bind(this));

  this.clef_length = clef_length;
  this.clef_start_x = clef_start_x;
  this.cleft_start_y = cleft_start_y;
  this.clef_y_spacing = clef_y_spacing;

  this.current_bar = null;
  this.next_bar = null;

  this.running = false;
}

practiceSession.prototype.start = function() {
  this.metronome.start();
  this.running = true;

  this.setup();
}

practiceSession.prototype.setup = function() {
  this.set_next_initial();
  this.current_bar = this.renderable_bars.shift();

  this.set_next_initial();
  this.next_bar = this.renderable_bars.shift();

  this.set_next_initial();

  this.current_bar.set_active();
  this.next_bar.set_next();
}

practiceSession.prototype.stop = function() {
  this.metronome.stop();
  this.running = false;

  if (this.current_bar !== null) {
    this.current_bar.remove();
  }
  if (this.next_bar !== null) {
    this.next_bar.remove();
  }
}

practiceSession.prototype.advance_bars = function() {
  if (this.running) {
    console.log("trying to advance bars");
    if (this.current_bar !== null) {
      // console.log("trying to remove current bar and set next as active");
      this.current_bar.remove();
      this.current_bar = this.next_bar;
      this.current_bar.set_active();
    } else {
      this.stop();
      // console.log("Trying to advance with empty current bar (this should not happen)");
    }
    if (this.renderable_bars.length > 0) {
      // console.log("shifting in new next bar");
      this.next_bar = this.renderable_bars.shift();
      this.next_bar.set_next();
      this.set_next_initial();
    } else {
      next_bar = null;
    }
  }
}

practiceSession.prototype.set_next_initial = function() {
  if (this.renderable_bars.length > 0) {
    this.renderable_bars[0].render_initial(this.clef_start_x, this.cleft_start_y + 2 * this.clef_y_spacing, this.clef_length);
  }
}

module.exports.practiceSession = practiceSession;