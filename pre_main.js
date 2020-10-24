const sleep = time => new Promise(resolve => setTimeout(resolve, time));

async function playAndPaint(){
  url = 'http://localhost/front/pronounce_app/scale.wav' //scale(7), 0000(30)
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

console.log('wwwwwaaa')
  await sleep(1000)
console.log('iiiittt')

  request.onload = async function() {
    //2.  decode response audio data, generating buffer
    audioCtx.decodeAudioData(request.response, async function(buffer) {

      // // 0. Testing slicing, it's ok
      // var begin = 8000
      // var end = begin + 100
      // audioBufferSlice(buffer, begin, end, function(error, slicedAudioBuffer) {
      //   playBuffer(slicedAudioBuffer, function(){ console.log('repoduced')})
      //   console.log(slicedAudioBuffer)
      // });



      //3.A slice in sub-bufers of delta miliseconds each
      var buffArray = new Array()
      var delta = 10 //25 50 mili secs
      var duration = Math.floor(buffer.duration * 1000) // mili secs
      var limit = 10*1000//miliseconds
      var cuts = new Array()
      for (var i=0; i+delta<duration && i<limit; i+=delta){ // left over is dropped
        cuts.push(i)
        // console.log('i: ' + i)
        // audioBufferSlice(buffer, i, i+delta, function(error, slicedAudioBuffer) {
        //   if (error) {
        //     console.error(error);
        //   } else {
        //     console.log(buffer)
        //     // buffArray.push(buffer)
        //   }
        // });
      }

      for (const cut of cuts){
        audioBufferSlice(buffer, cut, cut+delta, function(error, slicedAudioBuffer) {
          if (error) {
            console.error(error);
          } else {
            console.log(cut)
            console.log(slicedAudioBuffer)
            //playBuffer(slicedAudioBuffer, function(){ console.log('repoduced')})
            // buffArray.push(slicedAudioBuffer)



            // 4. get the FFT for the sub-buffer
            getFFT(slicedAudioBuffer, function(ffts){
              window.requestAnimationFrame(function(){})
              console.log(ffts)
              // paint column for this freqs

              const KEEP_FREQS = 0.5 // 0.1 first 10% of spectrum = 0-2k
              const LEN = ffts.length * KEEP_FREQS;
              const h = H / LEN;
              for (let k = 0; k < 3; k++) {
                ROW=ROW+1
                for (let j = 0; j < LEN; j++) {
                  const x = ROW//W - 1;
                  let rat = ffts[j] / 255;
                  // we need from 40 to 280 in hsl
                  let hue = Math.round((rat * 120) + 280 % 360); // from 280 until 400, % from 0 - 40
                  let sat = '100%';
                  let lit = 10 + (70 * rat) + '%'; // 10-80 %
                  ctx.beginPath();
                  ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
                  ctx.moveTo(x, H - (j * h));
                  ctx.lineTo(x, H - (j * h + h));
                  ctx.stroke();
                  }
                }
            });



          } // else
        });
        await sleep(delta);
      }




      // //3. slice in sub-bufers of delta miliseconds each
      // var delta = 100 //mili secs
      // var duration = Math.floor(buffer.duration * 1000) // mili secs
      // for (var i=0; i+delta<duration && i<10000; i+=delta){ // left over is dropped
      //   audioBufferSlice(buffer, i, i+delta, function(error, slicedAudioBuffer) {
      //     if (error) {
      //       console.error(error);
      //     } else {

      //       console.log('i: ' + i)            
      //       console.log(slicedAudioBuffer)

      //       playBuffer(slicedAudioBuffer, function(){
      //         console.log('repoduced')
      //       });
      //       await sleep(1000);

      //       // sleep(2000).then(() => {
      //       //   playBuffer(slicedAudioBuffer, function(){
      //       //     console.log('repoduced')
      //       //   });
      //       // });

            
      //       //4. get the FFT for the sub-buffer

      //       // getFFT(slicedAudioBuffer, function(ffts){
      //       //   window.requestAnimationFrame(function(){})
      //       //   console.log(ffts)
      //       //   // paint column for this freqs

      //       //   const LEN = ffts.length;
      //       //   const h = H*1 / LEN;
      //       //   ROW=ROW+1
      //       //   const x = ROW//W - 1;
      //       //   console.log('x: ' + x)
      //       //   for (let j = 0; j < LEN/1; j++) {
      //       //     let rat = ffts[j] / 255;
      //       //     // we need from 40 to 280 in hsl
      //       //     let hue = Math.round((rat * 120) + 280 % 360); // from 280 until 400, % from 0 - 40
      //       //     let sat = '100%';
      //       //     let lit = 10 + (70 * rat) + '%'; // 10-80 %
      //       //     ctx.beginPath();
      //       //     ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
      //       //     ctx.moveTo(x, H - (j * h));
      //       //     ctx.lineTo(x, H - (j * h + h));
      //       //     ctx.stroke();
      //       //   }

      //       // });
      //     }
      //   });
      // }




    }, function(){console.log('error')});
  }
  // 1. send request
  request.send();

}