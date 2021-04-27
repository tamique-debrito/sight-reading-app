const Constants = require('./constants');
Vex = require('./vexflow');
VF = Vex.Flow;


VISUAL_TRANSITION_TIME = Constants.GENERAL.TRANSITION_TIME;

const renderableBar = function(notes, clef_type, beats_per_bar, render_context, voice_length) {
  let stave_notes = notes.map((e, i) => new VF.StaveNote({clef: clef_type, keys: [e.note], duration: e.len_fmt}));
  let voice = new VF.Voice({num_beats: beats_per_bar,  beat_value: 4});
  voice.addTickables(stave_notes);
  var formatter = new VF.Formatter().joinVoices([voice]).format([voice], voice_length);

  this.clef_type = clef_type;
  this.time_signature = `${beats_per_bar}/4`;
  this.voice = voice
  this.render_context = render_context;
  this.group = null;
}

renderableBar.prototype.render_initial = function(x, y, clef_length) {
  let stave = new VF.Stave(x, y, clef_length).addClef(this.clef_type).addTimeSignature(this.time_signature);
  this.group = this.render_context.openGroup();
  this.group.classList.add('hidden');
  stave.setContext(this.render_context).draw();
  this.voice.draw(this.render_context, stave);
  this.render_context.closeGroup();
}

renderableBar.prototype.set_next = function() {
  this.group.classList.add('next');
}

renderableBar.prototype.set_active = function() {
  this.group.classList.add('active');
}

renderableBar.prototype.remove = function(time_until_remove=VISUAL_TRANSITION_TIME * 1000) {
  this.group.classList.add('remove');
  setTimeout(() => this.render_context.svg.removeChild(this.group), time_until_remove);
}

module.exports.renderableBar = renderableBar;