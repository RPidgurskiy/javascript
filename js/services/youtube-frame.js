class YouTubeFrame {
  constructor() {
    this.playerRef = document.querySelectorAll('.js-youtube-frame');
    this.player = null;
  }

  createPlayer(playerRef) {
    const urlString = playerRef.getAttribute('data-video-id');
    const url = new URL(urlString);
    const currentVersion = url.searchParams.get('v');
    const { id } = playerRef;

    /* global YT */
    /* eslint no-undef: "error" */
    this.player = new YT.Player(id, {
      height: '360',
      width: '640',
      videoId: currentVersion,
    });
  }

  stopPlayer() {
    this.player.stopVideo();
  }

  init() {
    if (this.playerRef.length > 0) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubePlayerAPIReady = () => {
        this.playerRef.forEach((player) => {
          this.createPlayer(player);
        });
      };
    }
  }
}
export default YouTubeFrame;
