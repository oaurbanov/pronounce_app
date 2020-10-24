// https://miguelmota.com/bytes/slice-audiobuffer/

// var audioCtx = new (window.audioCtx || window.webkitaudioCtx);

function audioBufferSlice(buffer, begin, end, callback) {
  //begin and end are in mili secs
  
  if (!(this instanceof audioBufferSlice)) {
    console.log('is not and instance :(')
    return new audioBufferSlice(buffer, begin, end, callback);
  }

  var error = null;

  var duration = buffer.duration;
  var channels = buffer.numberOfChannels;
  var rate = buffer.sampleRate;

  if (typeof end === 'function') {
    callback = end;
    end = duration;
  }

  // milliseconds to seconds
  begin = begin/1000;
  end = end/1000;

  if (begin < 0) {
    error = new RangeError('begin time must be greater than 0');
  }

  if (end > duration * rate) {
    error = new RangeError('end time must be less than or equal to ' + duration*rate);
  }

  if (typeof callback !== 'function') {
    error = new TypeError('callback must be a function');
  }

  var startOffset = rate * begin;
  var endOffset = rate * end;
  var frameCount = endOffset - startOffset;
  var newArrayBuffer;

  try {
    newArrayBuffer = audioCtx.createBuffer(channels, endOffset - startOffset, rate);
    var anotherArray = new Float32Array(frameCount);
    var offset = 0;

    for (var channel = 0; channel < channels; channel++) {
      buffer.copyFromChannel(anotherArray, channel, startOffset);
      newArrayBuffer.copyToChannel(anotherArray, channel, offset);
    }
  } catch(e) {
    error = e;
  }

  callback(error, newArrayBuffer);
}




// function old_AudioBufferSlice(buffer, begin, end, callback) {
//   //begin and end are indexes of buffer
//   if (!(this instanceof AudioBufferSlice)) {
//     return new AudioBufferSlice(buffer, begin, end, callback);
//   }

//   var error = null;

//   var duration = buffer.duration;
//   var channels = buffer.numberOfChannels;
//   var rate = buffer.sampleRate;

//   if (typeof end === 'function') {
//     callback = end;
//     end = duration;
//   }

//   // // milliseconds to seconds
//   // begin = begin/1000;
//   // end = end/1000;

//   if (begin < 0) {
//     error = new RangeError('begin time must be greater than 0');
//   }

//   if (end > duration * rate) {
//     error = new RangeError('end time must be less than or equal to ' + duration*rate);
//   }

//   if (typeof callback !== 'function') {
//     error = new TypeError('callback must be a function');
//   }

//   var startOffset = begin//rate * begin;
//   var endOffset = end//rate * end;
//   var frameCount = endOffset - startOffset;
//   var newArrayBuffer;

//   try {
//     newArrayBuffer = audioCtx.createBuffer(channels, endOffset - startOffset, rate);
//     var anotherArray = new Float32Array(frameCount);
//     var offset = 0;

//     for (var channel = 0; channel < channels; channel++) {
//       buffer.copyFromChannel(anotherArray, channel, startOffset);
//       newArrayBuffer.copyToChannel(anotherArray, channel, offset);
//     }
//   } catch(e) {
//     error = e;
//   }

//   callback(error, newArrayBuffer);
// }

// function print_hola(){
//   console.log('hola')
// }