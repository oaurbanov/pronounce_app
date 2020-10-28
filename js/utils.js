
const sleep = time => new Promise(resolve => setTimeout(resolve, time));


let melLog = (f) => 2595*Math.log10(1+(f/500));


const sliceBuffer = (buffer, begin, end) =>
//source  https://miguelmota.com/bytes/slice-audiobuffer/
  new Promise( (resolve) => {

    var error = null;

    var duration = buffer.duration;
    var channels = buffer.numberOfChannels;
    var rate = buffer.sampleRate;

    // milliseconds to seconds
    begin = begin/1000;
    end = end/1000;

    if (begin < 0) {
      error = new RangeError('begin time must be greater than 0');
    }

    if (end > duration * rate) {
      error = new RangeError('end time must be less than or equal to ' + duration*rate);
    }

    var startOffset = rate * begin;
    var endOffset = rate * end;
    var frameCount = endOffset - startOffset;
    var newAudioBuffer;

    try {
      newAudioBuffer = audioCtx.createBuffer(channels, endOffset - startOffset, rate);
      var anotherArray = new Float32Array(frameCount);
      var offset = 0;

      for (var channel = 0; channel < channels; channel++) {
        buffer.copyFromChannel(anotherArray, channel, startOffset);
        newAudioBuffer.copyToChannel(anotherArray, channel, offset);
      }
    } catch(e) {
      error = e;
      console.log(e)
    }

    resolve(newAudioBuffer)
  });


function normalize(data){
  //tried normalization, but not working
  var min  = Math.min(...data)
  var max  = Math.max(...data)
  // normalization range = -1,1
  data = data.getChannelData(0).map(function(x) { return ((x + min)/(max+min))*2 -1; })
}


//<canvas id="myChart" width="600" height="400" ></canvas>
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
