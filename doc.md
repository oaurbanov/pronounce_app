

Spectogram is ploted (but too slow) and can be modified in play.js

delta   :  milisecs, on segment to apply FFT. like window
fft_size : resolution of spectogram improves, but costly
delta_x    : just to print same colum k times
limit : should be adjusted regarding the size of canvas


# TODOs:

1. Improve performance of first canvas (play canvas)
2. Design nice UI
3. Send recorded sounds to server and analyse them with the RNN