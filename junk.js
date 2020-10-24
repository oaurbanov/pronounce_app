/*//1-------- deaing with async calls TODO
// https://www.html5rocks.com/en/tutorials/webaudio/intro/

var context;
var bufferLoader;
//window.onload = init;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '.audio/pourquoi/0000.wav',
      '.audio/pourquoi/1000.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);
  source1.start(0);
  source2.start(0);
}*/


//2---- audio api sync // Better is to bring it from the server

// // UPDATE: there is a problem in chrome with starting audio context
// //  before a user gesture. This fixes it.
// var started = null;
// window.addEventListener('click', () => {
//   if (started) return;
//   started = true;
//   initialize();
// })


function init() {

    // const audioCtx = new AudioContext();
    // const audio = new Audio("audio");
    // audio.crossOrigin = "anonymous";
    // console.log(audio)
    // const source = audioCtx.createMediaElementSource(audio);
    // source.connect(audioCtx.destination);
    // audio.play();    


// for cross browser
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// load some sound
const audioElement = document.querySelector('audio');
const source = audioCtx.createMediaElementSource(audioElement);
console.log(source)

//source.connect(audioCtx.destination);
//audioElement.play();

// TODO extract ftt and paint it, then organize code nicely with promises

var analyser = audioCtx.createAnalyser();
analyser.fftSize = 4096;
source.connect(analyser);

const DATA = new Uint8Array(analyser.frequencyBinCount); //fft in binary
analyser.getByteFrequencyData(DATA); // fft in bytes
console.log(DATA)

}





///-----------  trying 2:


// Get AudioContext singleton
var context = null;
window.addEventListener('click', () => {
  if (context != null) return;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
})



function init2(url) {
  console.log('init2')
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      treatBuffer(buffer)
    }, onError);
  }
  request.send();
}

function getFTT(buffer){
  // 1. get FFT
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer; 

  //source.connect(context.destination); // important: connect it, to play sound
  // //Set up audio node network
  // audioSourceNode.connect(analyserNode);
  // analyserNode.connect(context.destination);

  console.log('buffer----') 
  console.log(source)
  console.log(buffer)
  console.log('buffer----') 

  var analyser = context.createAnalyser();
  analyser.fftSize = 4096;

  source.connect(analyser);
  analyser.connect(context.destination);
  // connections https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getFloatFrequencyData

  const DATA = new Uint8Array(analyser.frequencyBinCount); //fft in binary


  analyser.getByteFrequencyData(DATA); // fft in bytes
  console.log(DATA) // length: 2048

  // Freq bands are splited equaly
  // freq_n = n * samplerate/fftSize = n * 44100/4096 = n * 10.767 Hz
  // https://bm.enthuses.me/buffered.php?bref=4588


  //2. logging the data value by value
  for (let i = 0; i < DATA.length; i++) {
    let rat = DATA[i] / 255.0;
    console.log(rat)
  }
  // TODO FFT has just zeros

}

function treatBuffer(buffer){
  console.log(buffer) // length: 33696, duration: 0.7640816326530612, sampleRate: 44100
  getFTT(buffer)

  var begin = 20000;
  var end = begin + 4096; // if it is equal to fftsize I asume algorithm will be faster
  AudioBufferSlice(buffer, begin, end, function(error, slicedAudioBuffer) {
    if (error) {
      console.error(error);
    } else {
      var source = context.createBufferSource();
      source.buffer = slicedAudioBuffer;
      console.log(slicedAudioBuffer)
      getFTT(slicedAudioBuffer)
    }
  });


}


function onError(){
  console.log('error init2')
}




function init3(url){

console.log('init3')

//Create audio source
//Here, we use an audio file, but this could also be e.g. microphone input
const audioEle = new Audio();
audioEle.src = '0000.wav';//insert file name here
audioEle.autoplay = true;
audioEle.preload = 'auto';
const audioSourceNode = context.createMediaElementSource(audioEle);

console.log(audioSourceNode)

//Create analyser node
const analyserNode = context.createAnalyser();
analyserNode.fftSize = 4096;//256;
const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Float32Array(bufferLength);

console.log(dataArray)
//Set up audio node network
audioSourceNode.connect(analyserNode);
analyserNode.connect(context.destination);

//Get spectrum data
analyserNode.getFloatFrequencyData(dataArray);
console.log(dataArray)

//2. logging the data value by value
for (let i = 0; i < dataArray.length; i++) {
  let rat = dataArray[i] / 255.0;
  console.log(rat)
}
// TODO FFT has just zeros

}


//------------------------