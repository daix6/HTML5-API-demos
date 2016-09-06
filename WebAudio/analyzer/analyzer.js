;(function(w) {

'use strict';

var canvas = document.getElementsByTagName('canvas')[0];
var audio = document.getElementsByTagName('audio')[0];

// function Visualizer(audio : HTMLAudioElement, canvas : HTMLCanvasElement) {
  
function Visualizer(audio, canvas) {
  this.audio = audio;
  this.canvas = canvas;
  this.WIDTH = canvas.width;
  this.HEIGHT = canvas.height;

  this.canvasCtx = canvas.getContext('2d');
  this.audioCtx = new (w.AudioContext || w.webkitAudioContext)();
  this.source = this.audioCtx.createMediaElementSource(audio);

  this.init();
  this.initAnalyzer();
}

Visualizer.prototype.init = function _init() {
  // Background
  this.canvasCtx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  this.canvasCtx.fillStyle = 'rgb(100, 100, 100)';
  this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
};

Visualizer.prototype.initAnalyzer = function _analyzer() {
  this.analyzer = this.audioCtx.createAnalyser();
  this.source.connect(this.analyzer);
  this.analyzer.connect(this.audioCtx.destination);

  this.analyzer.fftSize = 128;
  this.bufferLength = this.analyzer.frequencyBinCount
  this.waveArray = new Float32Array(this.bufferLength);
  this.frequencyArray = new Uint8Array(this.bufferLength);
}

Visualizer.prototype.drawWaveOnCanvas = function _dwoc() {
  this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

  this.canvasCtx.lineWidth = 2;
  this.canvasCtx.strokeStyle = '#000';

  this.canvasCtx.beginPath();

  var sliceWidth = this.WIDTH * 1.0 / this.bufferLength;
  var x = 0, y = (this.waveArray[0] + 1) * this.HEIGHT / 2;

  this.canvasCtx.moveTo(x, y);
  for (var i = 1; i < this.bufferLength; i++) {
    x += sliceWidth;
    y = (this.waveArray[i] + 1) * this.HEIGHT / 2;
    this.canvasCtx.lineTo(x, y);
  }
  this.canvasCtx.lineTo(this.WIDTH, (this.waveArray[this.bufferLength - 1] + 1) * this.HEIGHT / 2);

  this.canvasCtx.stroke();
}

Visualizer.prototype.drawFrequencyOnCanvas = function _dfoc() {

  var barWidth = (this.WIDTH / this.bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for (var i = 0; i < this.bufferLength; i++) {
    barHeight = this.frequencyArray[i] / 2;
    this.canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 66, 66)';
    this.canvasCtx.fillRect(x, this.HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

Visualizer.prototype.drawAnalyzer = function _df() {
  if (!this.audio.paused) {
    this.analyzer.getFloatTimeDomainData(this.waveArray); // [-1, 1]
    this.analyzer.getByteFrequencyData(this.frequencyArray);
    this.drawWaveOnCanvas();
    this.drawFrequencyOnCanvas();
  }

  var self = this;
  requestAnimationFrame(function () {
    self.drawAnalyzer();
  });
}

var v = new Visualizer(audio, canvas);
v.drawAnalyzer();

}(window));
