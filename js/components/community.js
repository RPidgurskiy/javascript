import Masonry from '../../../node_modules/masonry-layout/masonry';

class Community {
  constructor() {
    this.communityWrapper = document.querySelector('.js-community-wrapper');
    this.grid = document.querySelector(".discover-community__grid");
  }

  init() {
    if(this.communityWrapper) {
      const msnry = new Masonry( this.grid, {
        itemSelector: '.c-news-card',
        gutter: 16,
        horizontalOrder: true,
      });
    }
  }
}

export default Community;

