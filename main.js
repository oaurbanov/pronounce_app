// window.onload = function() {


console.log("hello world 6")

const canvas = document.getElementById('cv1');
const W = canvas.width
const H = canvas.height
const ctx = canvas.getContext('2d');


// ctx.fillStyle = 'hsl(280, 100%, 10%)'; // 280= purple, saturation, light
// ctx.fillRect(0, 0, W, H);

// ctx.fillStyle = 'red';
// ctx.fillRect(20, 20, 150, 100);
// ctx.fillStyle = 'blue';
// ctx.fillRect(200, 20, 150, 100);



// Get AudioContext singleton
var audioCtx = null;
var analyserNode = null;
var sourceNode;
window.addEventListener('click', () => {
  if (audioCtx != null) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioCtx.createAnalyser();
  // analyserNode.minDecibels = -90;
  // analyserNode.maxDecibels = -10;
  // analyserNode.smoothingTimeConstant = 0.85;
})


// this functions are not implementing well callback
// since I noticed buffer is not ready when calling
function playBuffer(buffer, callback){
  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = buffer;
  //console.log(sourceNode.buffer.getChannelData(0)) //raw PCM data
  sourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination)

  sourceNode.start(0); //play
  sourceNode.onended = function(event) {
    callback();
  }

}

// this functions are not implementing well callback
// since I noticed buffer is not ready when calling
function getFFT(buffer, callback, fftSize=2048){//2048
  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = buffer;
  //console.log(sourceNode.buffer.getChannelData(0)) //raw PCM data
  sourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination) // to output sound on speakers

  sourceNode.start(0); //play
  //onened, buffer will be ready to be read
  sourceNode.onended = function(event) {
    //fftSize : 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
    analyserNode.fftSize = fftSize//2048;//512
    var freqs = new Uint8Array(analyserNode.frequencyBinCount); // len = fftSize/2
    analyserNode.getByteFrequencyData(freqs);
    //Freq bands are splited equaly
    //freq_n = n * (samplerate/fftSize) = n * (44100/2048) = n * 21.533 Hz
    // BW = 21.533 Hz  - 22050 Hz
    //drawFreqBars(freqs, sourceNode.buffer.sampleRate, analyserNode.fftSize)
    callback(freqs);
  }
}



// }