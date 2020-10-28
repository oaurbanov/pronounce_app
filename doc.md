

Spectograms can be parametrized in play.js and record.js with CONSTS:

delta   :  milisecs, on segment to apply FFT. like window
fftSize : resolution of spectogram improves, but costly
delta_x    : just to print same colum k times
limit : should be adjusted regarding the size of canvas
KEEP_FREQS : keep a portion of the spectrum
MIC_CALIBRATION: calibration for record specto, to adjust graph to play specto

# TODOs:

1. Send recorded sounds to server and analyse them with the RNN
2. Parametrize record.js and play.js