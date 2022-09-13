class DeleteBanner {
  constructor(banner) {
    this.banner = banner;
    this.deleteBtn = banner.querySelector('.js-delete-banner-btn');
  }

  deleteBanner(e) {
    e.preventDefault();
    this.banner.remove();
  }

  listeners() {
    this.deleteBtn.addEventListener('click', (e) => {
      this.deleteBanner(e);
    });
  }

  init() {
    this.listeners();
  }
}

export default DeleteBanner;
