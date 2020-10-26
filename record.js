
const sleep = time => new Promise(resolve => setTimeout(resolve, time));


const recordAudio = () =>
  new Promise( async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    // const mediaRecorder = new MediaRecorder(stream);
    // const audioChunks = [];

    // mediaRecorder.ondataavailable = (event) => {
    //   // console.log(event.data) //14562
    //   audioChunks.push(event.data)
    // }

    // const start = () => mediaRecorder.start()
    // const stop = () =>
    //   new Promise(resolve => {
    //     mediaRecorder.addEventListener("stop", () => {
    //       const audioBlob = new Blob(audioChunks)
    //       const audioUrl = URL.createObjectURL(audioBlob);
    //       const audio = new Audio(audioUrl);
    //       const play = () => audio.play()
    //       resolve({ audioBlob, audioUrl, play})
    //     });
    //     mediaRecorder.stop()
    //   });

    //here process(stream) like spec, to paint cv2
    //(maybe I cannot consume stream in 2 different points :S)
    paint(stream)

    resolve => {}
    // resolve({start, stop})
});

function paint(stream){
  console.log(stream)
  const audioSourceNode = audioCtx.createMediaStreamSource(stream);
  audioSourceNode.connect(analyserNode)

  // 2. get FTT

  var fft_size = 8192 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
  const ffts = new Uint8Array(analyserNode.frequencyBinCount); //fft in binary

  //5. paint column for this freqs
  const KEEP_FREQS = 0.7 // 0.1 first 10% of spectrum = 0-2k
  const LEN = ffts.length * KEEP_FREQS; // 1024 *0.5 = 512

  var x = 0 
  var sr = stream.sampleRate
  var sr_f = sr/fft_size

  var h = 0
  var hMax =  melLog(2+ (LEN*sr_f) -1)
  var delta_x = 1

  console.log('before loop')


  function loop() {
    window.requestAnimationFrame(loop);

    // // 3.  get actual image, clear canvas and put image slided
    // let imgData = CTX.getImageData(1, 0, W - 1, H2);
    // CTX.fillRect(0, 0, W, H2);
    // CTX.putImageData(imgData, 0, 0);

    // 4. paint next row      
    analyserNode.getByteFrequencyData(ffts); // fft in bytes
    for (let i = 0; i < LEN; i++) {
      console.log('i: '+i)
      console.log(ffts)
      let rat = ffts[i] / 255;
      // we need from 40 to 280 in hsl
      let hue = Math.round(rat * 360);
      let sat = '100%';
      let lit = 10 + (70 * rat) + '%'; // 10-80 %

      var last_h = h
      h =  (melLog(2+ (i*sr_f) -1)/hMax)*(H2-1) //(value between 0 and H-1
      ctx2.fillStyle = `hsl(${hue}, ${sat}, ${lit})`;
      ctx2.fillRect(x, H2-last_h, (x)- x+delta_x, (H2-last_h)- H2-h )
    }
    x += delta_x
  }
  loop();
}

// const recordAndPaint= async (time=1000) => {
//   const recorder = await recordAudio();
//   // const recordButton = document.getElementById('record')
//   // recordButton.disable = true
//   // recorder.start()
//   // await sleep(time)
//   // const audio = await recorder.stop()
//   // audio.play()
//   // await sleep(time)
//   // recordButton.disable = false
// } 

function recordAndPaint() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioCtx.createAnalyser();

  navigator.mediaDevices.getUserMedia({audio: true})
  .then(procez)

  function procez(stream){
    console.log(stream)
    const audioSourceNode = audioCtx.createMediaStreamSource(stream);
    audioSourceNode.connect(analyserNode)
    analyserNode.connect(audioCtx.destination)

    // 2. get FTT

    var fft_size = 8192 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
    analyserNode.fftsize = fft_size
    const ffts = new Uint8Array(analyserNode.frequencyBinCount); //fft in binary

    //5. paint column for this freqs
    const KEEP_FREQS = 0.5 // 0.1 first 10% of spectrum = 0-2k
    const LEN = ffts.length * KEEP_FREQS; // 1024 *0.5 = 512
    console.log(ffts)

    var x = 0 
    var sr = 44100//stream.sampleRate
    var sr_f = sr/fft_size

    var h = 0
    var hMax =  melLog(2+ (LEN*sr_f) -1)
    var delta_x = 5

    console.log('before loop')


    function loop() {
      window.requestAnimationFrame(loop);

      // // 3.  get actual image, clear canvas and put image slided
      // let imgData = CTX.getImageData(1, 0, W - 1, H2);
      // CTX.fillRect(0, 0, W, H2);
      // CTX.putImageData(imgData, 0, 0);

      // 4. paint next row      
      analyserNode.getByteFrequencyData(ffts); // fft in bytes
      for (let i = 0; i < LEN; i++) {
        //console.log('i: '+i)
        //console.log(ffts)
        let rat = ffts[i] / 255;
        // we need from 40 to 280 in hsl
        let hue = Math.round(rat * 360);
        let sat = '100%';
        let lit = 10 + (70 * rat) + '%'; // 10-80 %

        var last_h = h
        h =  (melLog(2+ (i*sr_f) -1)/hMax)*(H2-1) //(value between 0 and H-1
        ctx2.fillStyle = `hsl(${hue}, ${sat}, ${lit})`;
        ctx2.fillRect(x, H2-last_h, (x)- x+delta_x, (H2-last_h)- H2-h )
      }
      x += delta_x
    }
    loop();    
  }

}

async function new_recordAdnPaint(){
  // url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3'
  // url = 'http://localhost/front/pronounce_app/audio/pourquoi/0000.wav' //scale(7), 0000(0.7), redhot(30)
  url = 'http://localhost/front/pronounce_app/0000.wav' //scale(7), 0000(0.7), redhot(30)
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // testing await method woorks
  console.log('wwwwwaaa')
  await sleep(1000)
  console.log('iiiittt')

  request.onload = async function() {
    //2.  decode response audio data, generating buffer
    audioCtx.decodeAudioData(request.response, async function(buffer) {

      //3.A slice in sub-bufers extract cut indexes for that
      var delta = 10 //2 25 50 mili secs
      var duration = Math.floor(buffer.duration * 1000) // mili secs
      var limit = 10*1000//miliseconds
      var cuts = new Array()
      for (var i=0; i+delta<duration && i<limit; i+=delta){ // left over is dropped
        cuts.push(i)
      }

      //3.B Process each delta, get subbuffer array
      var x = 0 
      var sr = buffer.sampleRate
      var fft_size = 8192 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
      var sr_f = sr/fft_size
      for (const cut of cuts){
        audioBufferSlice(buffer, cut, cut+delta, function(error, slicedAudioBuffer) {
          if (error) {
            console.error(error);
          } else {

            // console.log(cut)
            // console.log(slicedAudioBuffer)
            // playBuffer(slicedAudioBuffer, function(){ console.log('repoduced')})

            // 4. get the FFT for the sub-buffer
            getFFT(slicedAudioBuffer, function(ffts){
              //window.requestAnimationFrame(getFFT) // not really needed
              //console.log(ffts)

              //5. paint column for this freqs
              const KEEP_FREQS = 0.7 // 0.1 first 10% of spectrum = 0-2k
              const LEN = ffts.length * KEEP_FREQS; // 1024 *0.5 = 512

              var h = 0
              var hMax =  melLog(2+ (LEN*sr_f) -1)
              var delta_x = 5

              for (let j = 0; j < LEN; j++) {
                let rat = ffts[j] / 255;
                // we need from 40 to 280 in hsl
                let hue = (1*360*rat)// 30 + (300*rat) //30 -330
                //let hue = Math.round((rat * 120) + 280 % 360); // from 280 until 400, % from 0 - 40
                let sat = '100%';
                let lit = 10 + (70 * rat) + '%'; // 10-80 %

                var last_h = h
                h =  (melLog(2+ (j*sr_f) -1)/hMax)*(H-1) //(value between 0 and H-1
                ctx.fillStyle = `hsl(${hue}, ${sat}, ${lit})`;
                ctx.fillRect(x, H-last_h, (x)- x+delta_x, (H-last_h)- H-h )
              }
              x += delta_x
            }, fft_size);

          } // else
        });
        await sleep(delta);
      }



    }, function(){console.log('error')});
  }
  // 1. send request
  request.send();

}
