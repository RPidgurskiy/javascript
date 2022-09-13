class LoadAjaxLinks {
  constructor() {
    this.ajaxLinks = document.querySelectorAll('a[data-ajax]');
  }

  listeners() {
    if (this.ajaxLinks.length > 0) {
      this.ajaxLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const url = link.dataset.ajax;
          window.location = url;
        });
      });
    }
  }

  init() {
    this.listeners();
  }
}

export default LoadAjaxLinks;
