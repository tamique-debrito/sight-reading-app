Vex = require('./vexflow');
practiceSession = require('./practice-session');

practiceSession = practiceSession.practiceSession;

VF = Vex.Flow;
// Create an SVG renderer and attach it to the DIV element named "boo".

window.onload = () => {
  var app = new App();
  document.getElementById('start-button').addEventListener('click', app.run.bind(app))
  document.getElementById('stop-button').addEventListener('click', app.stop.bind(app))
};

const App = function() {
  this.initialized = false;
  this.audioCtx = null;
  this.renderCtx = null;
  this.session = null;
};

function getInputs() {
  return {
    note_type: document.getElementById('note-type').value,
    num_bars: parseInt(document.getElementById('num-bars').value) || 1e3,
    bpm: parseInt(document.getElementById('bpm').value),
    beats_per_bar: parseInt(document.getElementById('time-sig').value),
    clef_type: document.getElementById('clef-type').value
  };
};

App.prototype.run = function() {

  let options = getInputs();

  if (!this.initialized){
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    var div = document.getElementById("sheet-render");
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(400, 400);

    this.audioCtx = new AudioContext();
    this.renderCtx = renderer.getContext();;
    this.initialized = true; 
  }
  this.session = new practiceSession(options.num_bars, options.note_type, options.beats_per_bar, options.beats_per_bar, options.bpm,
    2, options.clef_type, this.renderCtx, this.audioCtx);
  this.session.start();
};

App.prototype.stop = function() {
  this.session.stop();
};
