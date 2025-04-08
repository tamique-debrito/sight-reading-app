async function getFile(audioContext, filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function genBuffer(audioContext, freq) {
  var myArrayBuffer = audioContext.createBuffer(2, audioContext.sampleRate * 0.05, audioContext.sampleRate);

  for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < myArrayBuffer.length; i++) {
      nowBuffering[i] = Math.sin(i * freq / 41000 * 6.28);
    }
  }
  return myArrayBuffer;
}

function playSample(audioContext, audioBuffer, time) {
  const sampleSource = audioContext.createBufferSource();
  sampleSource.buffer = audioBuffer;
  sampleSource.connect(audioContext.destination);
  sampleSource.start(time);
  return sampleSource;
}

module.exports.getFile = getFile;
module.exports.playSample = playSample;
module.exports.genBuffer = genBuffer;
