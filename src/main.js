Metronome = require('./metronome');
Metronome = Metronome.Metronome;

const count_in_beats = 4;
const main_beats = 8;
const beats_per_bar = 4;
const bpm = 120;

function callback() {
  document.getElementById('click-here').innerHTML += 'Tick...'
}

window.onload = function () {
  document.querySelector('#click-here').addEventListener('click', function() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    metronome = new Metronome(count_in_beats, main_beats, beats_per_bar, bpm, audioCtx, callback);
    metronome.start();
  });
};