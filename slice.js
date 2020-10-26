//source  https://miguelmota.com/bytes/slice-audiobuffer/

const sliceBuffer = (buffer, begin, end) =>
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
