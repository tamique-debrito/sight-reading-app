Vex = require('./vexflow');

VF = Vex.Flow;
// Create an SVG renderer and attach it to the DIV element named "boo".

window.onload = () => document.querySelector('#click-here').addEventListener('click', test_run);

function test_run() {
  var div = document.getElementById("sheet-render");
  var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

  // Configure the rendering context.
  renderer.resize(400, 400);
  var context = renderer.getContext();

  var voice1 = get_voice();
  var stave1 = new VF.Stave(10, 10, 300).addClef('treble').addTimeSignature('4/4');
  group1 = context.openGroup();
  stave1.setContext(context).draw();
  voice1.draw(context, stave1);
  context.closeGroup();

  var voice2 = get_voice();
  var stave2 = new VF.Stave(10, 10 + 160, 300).addClef('treble').addTimeSignature('4/4');
  group2 = context.openGroup();
  stave2.setContext(context).draw();
  voice2.draw(context, stave2);
  context.closeGroup();

  setTimeout(() => {
    group1.classList.add('remove');
    group2.classList.add('active');
    setTimeout(() => context.svg.removeChild(group1), 1000);
  }, 1000);
}


function get_voice() {
  var notes = [new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }), new VF.StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }), new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }), new VF.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })];
  var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
  voice.addTickables(notes);
  var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 250);
  return voice;
}