
const sleep = time => new Promise(resolve => setTimeout(resolve, time));


const recordAudio = () =>
  new Promise( async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      // console.log(event.data) //14562
      audioChunks.push(event.data)
    }

    const start = () => mediaRecorder.start()
    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          // Stop streaming
          stream.getTracks().forEach( (track) => {
            if (track.readyState == 'live' && track.kind === 'audio') {
                track.stop();
            }
          });
          const audioBlob = new Blob(audioChunks)
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play()
          console.log('stoping')
          resolve({ audioBlob, audioUrl, play})
        });
        mediaRecorder.stop()
      });

    resolve({start, stop, stream})
});

function paintOnCanvas(stream){
  console.log(stream)
  const audioSourceNode = audioCtx.createMediaStreamSource(stream);
  audioSourceNode.connect(analyserNode)
  analyserNode.connect(audioCtx.destination)

  // 2. get FTT

  var fft_size = 8192 // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
  analyserNode.fftsize = fft_size
  const ffts = new Uint8Array(analyserNode.frequencyBinCount); //fft in binary

  //5. paint column for this freqs
  const KEEP_FREQS = 0.7 // 0.1 first 10% of spectrum = 0-2k
  const LEN = ffts.length * KEEP_FREQS; // 1024 *0.5 = 512

  var x = 0 
  var sr = 44100//stream.sampleRate //TODO find out sample rate
  var sr_f = sr/fft_size

  var h = 0
  var hMax =  melLog(2+ (LEN*sr_f) -1)
  var delta_x = 5


  function loop() {

    let streamEnded = true
    stream.getTracks().forEach( (track) => {
      if (track.readyState != 'ended' && track.kind === 'audio') {
          streamEnded = false
      }
    });
    if (!streamEnded){
      window.requestAnimationFrame(loop);
    }

    // // 3.  get actual image, clear canvas and put image slided
    // let imgData = CTX.getImageData(1, 0, W - 1, H2);
    // CTX.fillRect(0, 0, W, H2);
    // CTX.putImageData(imgData, 0, 0);

    // 4. paint next row      
    analyserNode.getByteFrequencyData(ffts); // fft in bytes
    for (let i = 0; i < LEN; i++) {
      let rat = ffts[i] / 255;
      let hue = Math.round(rat * 360);
      let sat = '100%';
      let lit = 10 + (70 * rat) + '%'; // 10-80 %

      var last_h = h
      h =  (melLog(2+ (i*sr_f) -1)/hMax)*(H2-1) //(value between 0 and H-1
      ctx2.fillStyle = `hsl(${hue}, ${sat}, ${lit})`;
      ctx2.fillRect(x, H2-last_h, (x)- x+delta_x, (H2-last_h)- H2-h )
    }
    x += delta_x
    if (x >= W2) 
      x=0
  }
  loop();
}

const recordAndPaint= async (time=1000) => {
  console.log('recordAndPaint')
  const recorder = await recordAudio();

  //painting good, not blocking call :)
  paintOnCanvas(recorder.stream)

  // // For now I dont need these, just record and paintOnCanvas
  const recordButton = document.getElementById('record')
  recordButton.onclick = undefined
  recordButton.onmousedown = () => {
    console.log('onmousedown')
    recorder.start()
  }
  recordButton.onmouseup = async () => {
    console.log('onmouseup')
    const audio = await recorder.stop()
    //send to server
    await sleep(3000)
    audio.play()
    await sleep(3000)
  }

  // recorder.start()
  // await sleep(time)
  // const audio = await recorder.stop()
  // audio.play()
  // await sleep(time)
  // recordButton.disable = false

  // const recordButton = document.getElementById('record')
  // recordButton.disable = true
  // recorder.start()
  // await sleep(time)
  // const audio = await recorder.stop()
  // audio.play()
  // await sleep(time)
  // recordButton.disable = false

} 




function oldAndSafe_recordAdnPaint() {
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
    const KEEP_FREQS = 0.7 // 0.1 first 10% of spectrum = 0-2k
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

