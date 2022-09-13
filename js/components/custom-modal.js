const bodyScrollLock = require('body-scroll-lock');

class CustomModal {
  constructor(modalName, triggerBtn = '') {
    if (triggerBtn) {
      this.btn = document.querySelector(`.${triggerBtn}`);
    }
    this.modal = document.querySelector(`[data-modal='${modalName}']`);
    this.allModals = document.querySelectorAll('.js-custom-modal');
    if (this.modal) {
      try {
        this.closeBtn = this.modal.querySelector('.js-close-modal-btn');
      } catch (e) {
        this.closeBtn = null;
      }

      this.init();
    }
  }

  dismissAll() {
    try {
      bodyScrollLock.clearAllBodyScrollLocks();
      this.allModals.forEach((modal) => {
        modal.classList.remove('open');
      });
    } catch (e) {
      // console.log(e);
    }
  }

  open() {
    try {
      if (!this.modal.classList.contains('js-no-close-modal')) {
        this.dismissAll();
      }
      this.modal.classList.add('open');
      bodyScrollLock.disableBodyScroll(this.modal);
      const height = this.modal.querySelector('.modal-layout').offsetHeight;
      this.modal.querySelector('.modal-wrapper').style.minHeight = `${
        height + 64
      }px`;

      if (this.modal.classList.contains('js-no-close-modal')) {
        this.modal.style.zIndex = '10000';
      }
    } catch (e) {
      // console.log(e);
    }
  }

  close() {
    try {
      this.modal.classList.remove('open');
      bodyScrollLock.enableBodyScroll(this.modal);
      const video = this.modal.querySelector('video');
      if (video) {
        video.pause();
      }
    } catch (e) {
      // console.log(e);
    }
  }

  listeners() {
    try {
      document.addEventListener('click', (e) => {
        if (
          e.target.closest('.js-custom-modal') &&
          !e.target.closest('.modal-layout')
        ) {
          this.close();
        }
      });

      if (this.btn) {
        this.btn.addEventListener('click', () => {
          this.open(this.modal);
        });
      }

      this.closeBtn.addEventListener('click', () => {
        this.close();
      });
    } catch (e) {
      // console.log(e);
    }
  }

  init() {
    try {
      this.listeners();
    } catch (e) {
      // console.log(e);
    }
  }
}

export default CustomModal;
