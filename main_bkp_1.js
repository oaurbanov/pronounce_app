// window.onload = function() {

console.log("hello world 5")

// console.log(document)
const canvas = document.getElementById('cv1');
// console.log(canvas)

const ctx = canvas.getContext('2d');

ctx.fillStyle = 'red';
ctx.fillRect(20, 20, 150, 100);
ctx.fillStyle = 'blue';
ctx.fillRect(200, 20, 150, 100);






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

function playAndPaint(url){

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
      audioCtx.decodeAudioData(request.response, function(buffer) {
        sourceNode = audioCtx.createBufferSource();
        //sourceNode.connect(audioCtx.destination)
        sourceNode.buffer = buffer;
        //console.log(sourceNode.buffer.getChannelData(0)) //raw PCM data
        sourceNode.connect(analyserNode);
        //analyserNode.connect(audioCtx.destination)

        sourceNode.start(0); //play
        //onened, buffer will be ready to be read
        sourceNode.onended = function(event) {
          //fftSize : 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
          analyserNode.fftSize = 2048;//512
          var freqs = new Uint8Array(analyserNode.frequencyBinCount); // len = fftSize/2
          analyserNode.getByteFrequencyData(freqs);
          //Freq bands are splited equaly
          //freq_n = n * (samplerate/fftSize) = n * (44100/2048) = n * 21.533 Hz
          drawFreqBars(freqs, sourceNode.buffer.sampleRate, analyserNode.fftSize)
        }
      }, function(){console.log('error')});
  }
  request.send();

}



function drawFreqBars(data, sr/*44100*/, fsize){

  //fsize= 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768.
  console.log('samplerate = '+ sr)
  labels = [...Array(data.length).keys()].map(function(x) { return (x+1) * sr/fsize; });

  var ctxx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctxx, {
      // The type of chart we want to create
      type: 'bar',

      // The data for our dataset
      data: {
           labels: labels,
          datasets: [{
              label: 'Frequencies ',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: data
          }]
      },
      options: {responsive: false}
  });
}


// }