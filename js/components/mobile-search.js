class MobileSearch {
  constructor() {
    this.searchBtn = document.querySelector('.js-mobile-btn-search');
    this.closeBtn = document.querySelector('.js-search-coin-cancel');
  }

  listeners() {
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', () => {
        this.searchBtn.classList.add('search-open');
      });
      this.closeBtn.addEventListener('click', () => {
        this.searchBtn.classList.remove('search-open');
      });
    }
  }

  init() {
    this.listeners();
  }
}
export default MobileSearch;
