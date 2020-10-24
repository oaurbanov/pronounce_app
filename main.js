// window.onload = function() {

console.log("hello world 6")

const canvas = document.getElementById('cv1');
const W = canvas.width
const H = canvas.height
const ctx = canvas.getContext('2d');



ctx.fillStyle = 'hsl(280, 100%, 10%)'; // 280= purple, saturation, light
ctx.fillRect(0, 0, W, H);


// ctx.fillStyle = 'red';
// ctx.fillRect(20, 20, 150, 100);
// ctx.fillStyle = 'blue';
// ctx.fillRect(200, 20, 150, 100);






// Get AudioContext singleton
var audioCtx = null;
var analyserNode = null;
window.addEventListener('click', () => {
  if (audioCtx != null) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioCtx.createAnalyser();
  // analyserNode.minDecibels = -90;
  // analyserNode.maxDecibels = -10;
  // analyserNode.smoothingTimeConstant = 0.85;
})


var sourceNode;
var button = document.getElementById('play3');
var ROW = 0


// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// const sleep = time => new Promise(resolve => setTimeout(resolve, time));

// async function playAndPaint(){
//   url = 'http://localhost/front/pronounce_app/redhot.wav'
//   var request = new XMLHttpRequest();
//   request.open('GET', url, true);
//   request.responseType = 'arraybuffer';

//   request.onload = function() {
//     //2.  decode response audio data, generating buffer
//     audioCtx.decodeAudioData(request.response, function(buffer) {

//       // // 0. Testing slicing, it's ok
//       // var begin = 1000
//       // var end = begin + 11000
//       // audioBufferSlice(buffer, begin, end, function(error, slicedAudioBuffer) {
//       //   playBuffer(slicedAudioBuffer, function(){ console.log('repoduced')})
//       //   console.log(slicedAudioBuffer)
//       // });

//       //3. slice in sub-bufers of delta miliseconds each
//       var delta = 100 //mili secs
//       var duration = Math.floor(buffer.duration * 1000) // mili secs
//       for (var i=0; i+delta<duration && i<10000; i+=delta){ // left over is dropped
//         audioBufferSlice(buffer, i, i+delta, function(error, slicedAudioBuffer) {
//           if (error) {
//             console.error(error);
//           } else {
//             //4. get the FFT for the sub-buffer
            
//             // console.log(slicedAudioBuffer)
//             playBuffer(slicedAudioBuffer, function(){
//               console.log('repoduced')
//             });
//             await sleep(1000);

//             // sleep(2000).then(() => {
//             //   playBuffer(slicedAudioBuffer, function(){
//             //     console.log('repoduced')
//             //   });
//             // });
            

//             // getFFT(slicedAudioBuffer, function(ffts){
//             //   window.requestAnimationFrame(function(){})
//             //   console.log(ffts)
//             //   // paint column for this freqs

//             //   const LEN = ffts.length;
//             //   const h = H*1 / LEN;
//             //   ROW=ROW+1
//             //   const x = ROW//W - 1;
//             //   console.log('x: ' + x)
//             //   for (let j = 0; j < LEN/1; j++) {
//             //     let rat = ffts[j] / 255;
//             //     // we need from 40 to 280 in hsl
//             //     let hue = Math.round((rat * 120) + 280 % 360); // from 280 until 400, % from 0 - 40
//             //     let sat = '100%';
//             //     let lit = 10 + (70 * rat) + '%'; // 10-80 %
//             //     ctx.beginPath();
//             //     ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
//             //     ctx.moveTo(x, H - (j * h));
//             //     ctx.lineTo(x, H - (j * h + h));
//             //     ctx.stroke();
//             //   }

//             // });
//           }
//         });
//       }


//     }, function(){console.log('error')});
//   }
//   // 1. send request
//   request.send();

// }




function playBuffer(buffer, callback, fftSize=2048){//2048
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



function getFFT(buffer, callback, fftSize=2048){//2048
  sourceNode = audioCtx.createBufferSource();
  sourceNode.buffer = buffer;
  //console.log(sourceNode.buffer.getChannelData(0)) //raw PCM data
  sourceNode.connect(analyserNode);
  analyserNode.connect(audioCtx.destination)

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