import Plyr from 'plyr';

class VideoPlayer {
  constructor(video) {
    this.video = video;
    this.player = null;
  }

  init() {
    this.player = new Plyr(`#${this.video.id}`, {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'fullscreen',
      ],
    });

    if (this.video.querySelector('source')) {
      this.video.load();
    }
  }
}
export default VideoPlayer;
