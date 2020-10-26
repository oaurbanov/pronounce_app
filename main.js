// window.onload = function() {


console.log("hello world 7")

const canvas = document.getElementById('cv1');
const W = canvas.width
const H = canvas.height
const ctx = canvas.getContext('2d');

const cv2 = document.getElementById('cv2')
const W2 = cv2.width
const H2 = cv2.height
const ctx2 = cv2.getContext('2d')


// ctx.fillStyle = 'hsl(280, 100%, 10%)'; // 280= purple, saturation, light
// ctx.fillRect(0, 0, W, H);

// ctx.fillStyle = 'red';
// ctx.fillRect(20, 20, 150, 100);
// ctx.fillStyle = 'blue';
// ctx.fillRect(200, 20, 150, 100);


// Get AudioContext singleton
var audioCtx = null;
var analyserNode = null;
var sourceNode;
window.addEventListener('click', () => {
  if (audioCtx != null) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyserNode = audioCtx.createAnalyser();
  // analyserNode.minDecibels = -90;
  // analyserNode.maxDecibels = -10;
  // analyserNode.smoothingTimeConstant = 0.85;
})



// } // window.onload 