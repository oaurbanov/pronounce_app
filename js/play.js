// TODOs
// - parametrize consts


const extractFFT = (buffer, fftSize=2048) =>
//fftSize 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
  new Promise( (resolve) => {

    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = buffer;
    //console.log(sourceNode.buffer.getChannelData(0)) //raw PCM data
    sourceNode.connect(analyserNode);
    analyserNode.connect(audioCtx.destination) // to output sound on speakers

    sourceNode.start(0); //play
    sourceNode.onended = function(event) {
      analyserNode.fftSize = fftSize
      var ffts = new Uint8Array(analyserNode.frequencyBinCount); // len = fftSize/2
      analyserNode.getByteFrequencyData(ffts);
      //Freq bands are splited equaly
      //freq_n = n * (samplerate/fftSize) = n * (44100/2048) = n * 21.533 Hz
      // BW = 21.533 Hz  - 22050 Hz
      //drawFreqBars(ffts, sourceNode.buffer.sampleRate, analyserNode.fftSize)
      resolve(ffts)
    }
  });


const paintColumn = (x, delta_x, ffts, sr, fft_size) =>
  new Promise( (resolve) => {
    var sr_f = sr/fft_size

    const KEEP_FREQS = 0.7 // 0.1 first 10% of spectrum = 0-2k
    const LEN = ffts.length * KEEP_FREQS; // 1024 *0.5 = 512

    var h = 0
    var hMax =  melLog(2+ (LEN*sr_f) -1)

    for (let j = 0; j < LEN; j++) {
      let rat = ffts[j] / 255;
      let hue = Math.floor(1*360*rat)
      let sat = '100%';
      let lit = 10 + (70 * rat) + '%'; // 10-80 %

      var last_h = h
      h =  (melLog(2+ (j*sr_f) -1)/hMax)*(H-1) //value between 0 and H-1
      ctx.fillStyle = `hsl(${hue}, ${sat}, ${lit})`;
      ctx.fillRect(x, H-last_h, (x)- x+delta_x, (H-last_h)- H-h )
    }
    resolve()
  });


async function playAndPaint(){
  // url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3'
  // url = 'http://localhost/front/pronounce_app/audio/pourquoi/0000.wav' //scale(7), 0000(0.7), redhot(30)
  url = 'http://localhost/front/pronounce_app/audio/0000.wav' //scale(7), 0000(0.7), redhot(30)
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';


  request.onload = async () => {
    let buffer = await audioCtx.decodeAudioData(request.response)

    var delta = 10 //2 10 25 50 mili secs
    var duration = Math.floor(buffer.duration * 1000) // mili secs
    var limit = 10*1000//miliseconds

    var x = 0 
    var delta_x = 5
    for (var i=0; i+delta<duration && i<limit; i+=delta){ // left over is dropped
      let subbuffer = await sliceBuffer(buffer, i, i+delta)
      var fft_size = 2048 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
      let ffts = await extractFFT(subbuffer,fft_size)
      paintColumn(x, delta_x, ffts, subbuffer.sampleRate, fft_size)
      x += delta_x
    }
  }// request.onload

  // 1. send request
  request.send();

}