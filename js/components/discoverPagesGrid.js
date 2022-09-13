class DiscoverPagesGrid {
  constructor() {
    this.container = document.querySelector('.js-discover-pages-grid');
    this.skeleton = document.querySelector('.discover-pages__skeleton');
  }

  listeners() {
    window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if(clientHeight + scrollTop >= scrollHeight - 5) {
        this.showLoading()
      }
    });
  }

  showLoading() {
    this.skeleton.classList.add('visible')
    setTimeout(() => {
      this.getCard()
    }, 1000);
  }

  getCard() {
    //TODO: get cards logic
    const type = this.container.getAttribute('data-type');
    setTimeout(() => {
      this.skeleton.classList.remove('visible')
    }, 4000);
  }

  init() {
    if (this.container) {
      this.listeners()
    }
  }
}

export default DiscoverPagesGrid;
