

Spectograms can be parametrized in play.js and record.js with CONSTS:

delta   :  milisecs, on segment to apply FFT. like window
fftSize : resolution of spectogram improves, but costly
delta_x    : just to print same colum k times
limit : should be adjusted regarding the size of canvas
KEEP_FREQS : keep a portion of the spectrum


# TODOs:

1. Design nice UI
2. Send recorded sounds to server and analyse them with the RNN
3. Parametrize record.js and play.js