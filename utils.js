
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
