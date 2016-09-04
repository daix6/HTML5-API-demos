function format(num) {
  return num < 10 ? '0' + num : num;
}

function number2second(number) {
  var minute = (number / 60) | 0;
  var second = Math.round(number - minute * 60);

  return minute + ':' + format(second);
}

;(function (w, d, undefined) {

w.onload = init();

function init() {
  var audio = d.getElementById('audio');
  var source = d.getElementById('source');
  var song = d.getElementById('song');
  var play = d.getElementById('play');
  var mute = d.getElementById('mute');
  var current = d.getElementById('now');
  var duration = d.getElementById('duration');
  var interval = null;

  var temp = audio.currentSrc.split('/');
  song.textContent = temp[temp.length - 1];

  audio.addEventListener('loadstart', function() {
    console.log('loadstart');
  });

  audio.addEventListener('durationchange', function() {
    console.log('durationchange');
    duration.textContent = number2second(audio.duration);
  });

  audio.addEventListener('loadedmetadata', function() {
    console.log('loadedmetadata');
  });

  audio.addEventListener('loadeddata', function() {
    console.log('loadeddata');
  });

  audio.addEventListener('progress', function() {
    console.log('progress, downloading...');
  });

  audio.addEventListener('canplay', function() {
    console.log('canplay');
  });

  audio.addEventListener('canplaythrough', function() {
    console.log('canplaythrough');
  });

  // This event will also fired when we seek the progress bar of audio!
  // But this is not suitable for getting current time.
  // Because it's fired every 15~250ms, depend on implementation.
  audio.addEventListener('timeupdate', function() {
    console.log('timeupdate');
  });

  audio.addEventListener('play', function() {
    console.log('play');
    interval = setInterval(function () {
      current.textContent = number2second(audio.currentTime);
    }, 100);
  });

  audio.addEventListener('playing', function() {
    console.log('playing');
  });

  audio.addEventListener('pause', function() {
    console.log('pause');
    interval = null;
  });

  audio.addEventListener('ended', function() {
    console.log('ended');
    interval = null;
  });

  audio.addEventListener('volumechange', function(e) {
    console.log('volumechange %d', e.target.volume);
  }, false);

  play.onclick = function() {
    if (audio.paused) audio.play();
    else audio.pause();
  };

  mute.onclick = function() {
    // Setting audio.muted will trigger volumechange event but won't change volumechange event for real 
    if (audio.muted) {
      audio.muted = false;
      audio.volume = 1;
    } else {
      audio.muted = true;
      audio.volume = 0;
    }
  }

}

})(window, document, undefined);
