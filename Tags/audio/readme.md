## Audio Tag

Simple test on the audio tag.

Audio samples come from [here](http://www.bigsoundbank.com/sound-0124-rain-and-storm.html) and [here](https://www.freesound.org/people/Setuniman/sounds/352752/), thanks~

### Notes

1. `<audio>` won't display (`display: none`) when there isn't `controls` attribute. But it still can play if we add `<source>`. So we can design the appearance for it!
2. You can provide more than one `<source>`s for `<audio>` but it will only choose one and only play the one. The `loop` attribute just let the player loop the chosen `<source>` only. :joy:
3. For .mp3 audio, you should set the `type` attribute as `audio/mpeg` rather than `audio/mpeg`, otherwise the audio wouldn't be played.
4. There are so many [events](https://www.w3.org/wiki/HTML/Elements/audio) related to HTMLAudioElement.
  * No `load` event.
  * You can not get the duration until the `durationchange` event triggered.
  * The `timeupdate` will be triggered every 15ms~250ms, which is depended on the implementation, when the song is playing. It will also be triggered when we drag the progress bar. That's to say, when the `currentTime` IDL changed, this event will be triggered.
  * Setting the `muted` property will trigger `volumechange` event but won't really change the volume.
