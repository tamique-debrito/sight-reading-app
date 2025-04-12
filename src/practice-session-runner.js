Vex = require('./vexflow');
practiceSession = require('./practice-session');

practiceSession = practiceSession.practiceSession;

VF = Vex.Flow;

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
    time_sig: document.getElementById('time-sig').value,
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
  if (this.session !== null) {
    this.session.stop();
  }
  this.session = new practiceSession(options.num_bars, options.note_type, options.time_sig, options.bpm,
    2, options.clef_type, this.renderCtx, this.audioCtx);
  this.session.start(() => setButtonsState(false));
  setButtonsState(true);
};

App.prototype.stop = function() {
  this.session.stop();
  setButtonsState(false);
};

function setButtonsState(isRunning) {
  const startButton = document.getElementById('start-button');
  const stopButton = document.getElementById('stop-button');

  const deactivatableControls = document.getElementsByClassName('deactivatable-control');
  for (var control of deactivatableControls) {
    control.disabled = isRunning;
  }

  if (isRunning) {
    startButton.style.display = 'none';
    stopButton.style.display = 'inline-block';
  } else {
    startButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
  }
}