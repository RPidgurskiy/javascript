import axios from 'axios';

import CustomModal from './custom-modal';

const Draggabilly = require('draggabilly');

class Cover {
  constructor(cardCointainer, callbackAfterCoverUpload) {
    this.locationOrigin = window.location.origin;
    this.callbackAfterCoverUpload = callbackAfterCoverUpload;
    this.coverSrc = '';
    this.formData = new FormData();
    this.cardCointainer = cardCointainer;
    this.coverImage = document.querySelector('.b-cover__img');
    this.coverImgWrap = document.querySelector('.b-cover__img-wrap');
    this.coverFormImg = document.querySelector('#cover-image');
    this.repContainer = document.querySelector('.b-cover__reposition');
    this.repImg = document.querySelector('.b-cover__reposition img');
    this.navMain = document.querySelector('.b-cover__nav-main');
    this.navRep = document.querySelector('.b-cover__nav-rep');

    this.presets = document.querySelectorAll('.b-cover-presets__el');
    this.activePreset = document.querySelector('.js-active-preset');
    this.resetCloseButton = document.querySelector('.js-preset-close');
    this.coinPageAvatar = document.querySelector('.b-coin-setting__avatar');
    if (this.presets.length > 0) {
      this.modal = new CustomModal('cover-presets');
    }

    this.nav = {
      camera: document.querySelector('.b-cover__nav-item--camera'),
      picture: document.querySelector('.b-cover__nav-item--picture'),
      crop: document.querySelector('.b-cover__nav-item--crop'),
      trash: document.querySelector('.b-cover__nav-item--trash'),
      check: document.querySelector('.b-cover__nav-item--check'),
      cross: document.querySelector('.b-cover__nav-item--cross'),
    };
    if (this.coverImgWrap) {
      this.modal = new CustomModal('cover-presets');
      this.draggie = new Draggabilly(this.repImg, {
        axis: 'y',
      });
    }
    this.saveDefaultCoverBtn = document.querySelector('.js-save-default-cover-btn');
    this.activeDefaultCoverSrc = null;
    this.coverPreloader = `<div class="preloader-custom preloader-custom--cover js-cover-preloader">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1" stroke-width="2"/>
                            </svg>
                            <p>Loading banner</p>
                          </div>`;
  }

  showRepSection() {
    this.cardCointainer.classList.add('v-hidden');
    this.repContainer.style.display = 'block';
    this.navRep.style.display = 'block';
    this.navMain.style.display = 'none';
    if (this.coinPageAvatar) {
      this.coinPageAvatar.style.display = 'none';
    }
  }

  hideRepSection() {
    this.cardCointainer.classList.remove('v-hidden');
    this.repContainer.style.display = 'none';
    this.navRep.style.display = 'none';
    this.navMain.style.display = 'block';
    if (this.coinPageAvatar) {
      this.coinPageAvatar.style.display = 'block';
    }
  }

  insertPreloader() {
    document.querySelector('.b-cover').insertAdjacentHTML('beforeend', this.coverPreloader);
  }

  listeners() {
    if (this.presets.length > 0) {
      this.resetCloseButton.addEventListener('click', () => {
        this.modal.close();
      });

      this.presets.forEach((preset) => {
        preset.addEventListener('click', () => {
          const active = preset.dataset.value;
          this.activePreset.value = active;
          this.activeDefaultCoverSrc = preset.querySelector('img').getAttribute('src');
          this.presets.forEach((el) => el.classList.remove('active'));
          preset.classList.add('active');
        });
      });

      this.saveDefaultCoverBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.insertPreloader();
        this.coverSrc = this.activeDefaultCoverSrc;
        this.coverImage.setAttribute('src', this.coverSrc);
        this.repImg.setAttribute('src', this.coverSrc);
        this.callbackAfterCoverUpload(this.coverSrc);
        this.modal.close();
        this.nav.crop.style.display = 'block';
        this.nav.trash.style.display = 'block';
      });

      if (this.nav.picture) {
        this.nav.picture.addEventListener('click', () => {
          this.modal.open();
          this.presets.forEach((preset) => {
            preset.classList.remove('active');
          });
        });
      }
    }

    if (this.nav.camera) {
      this.nav.camera.addEventListener('click', () => {
        this.coverFormImg.click();
      });
    }

    if (this.coverFormImg) {
      this.coverFormImg.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        this.formData.set('file', file);
        this.coverSrc = URL.createObjectURL(file);
        this.repImg.setAttribute('src', this.coverSrc);

        reader.readAsText(file);
        reader.addEventListener('loadstart', () => {
          this.insertPreloader();
        });

        reader.addEventListener('loadend', () => {
          document.querySelector('.b-cover').querySelector('.js-cover-preloader').remove();
          this.showRepSection();
        });
      });
    }
    if (this.nav.crop) {
      this.nav.crop.addEventListener('click', () => {
        this.showRepSection();
      });
    }
    if (this.nav.cross) {
      this.nav.cross.addEventListener('click', () => {
        this.hideRepSection();
      });
    }
    if (this.nav.check) {
      this.nav.check.addEventListener('click', () => {
        this.hideRepSection();
        this.insertPreloader();

        axios
          .post(`${this.locationOrigin}/v2/api/files/upload`, this.formData)
          .then((response) => {
            this.coverSrc = response.data.full;
            this.coverImage.setAttribute('src', this.coverSrc);
            this.callbackAfterCoverUpload(this.coverSrc);
            this.nav.crop.style.display = 'block';
            this.nav.trash.style.display = 'block';
          });
      });
    }
    if (this.nav.trash) {
      this.nav.trash.addEventListener('click', () => {
        this.coverImage.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=');
        this.nav.trash.style.display = 'none';
        this.nav.crop.style.display = 'none';
        this.callbackAfterCoverUpload('');
      });
    }
    if (this.draggie) {
      this.draggie.on('dragEnd', () => {
        if (this.draggie.position.y > 0) {
          this.draggie.setPosition(0, 0);
        } else if (
          this.draggie.position.y <
          this.repImg.parentElement.offsetHeight - this.repImg.offsetHeight
        ) {
          this.draggie.setPosition(
            0,
            this.repImg.parentElement.offsetHeight - this.repImg.offsetHeight
          );
        }
      });
    }
  }

  init() {
    if (this.coverImgWrap) {
      this.listeners();
      if (
        this.coverImage.getAttribute('src') ===
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
      ) {
        if (this.nav && this.nav.crop && this.nav.trash) {
          this.nav.crop.style.display = 'none';
          this.nav.trash.style.display = 'none';
        }
      }
    }
  }
}
export default Cover;
