import axios from 'axios';
import Cropper from 'cropperjs';

import CustomModal from './custom-modal';

class AvatarEdit {
  openAvatarBtns: NodeList;

  editAvatarModal: CustomModal;

  cropAvatarModal: CustomModal;

  previewAvatarModal: CustomModal;

  addPhotoBtn: HTMLInputElement | null;

  cropPhotoBtn: HTMLButtonElement | null;

  deletePhotoBtn: HTMLButtonElement | null;

  zoomAvatarSlider: HTMLInputElement | null;

  alignAvatarSlider: HTMLInputElement | null;

  rotateAvatarLeft: HTMLButtonElement | null;

  rotateAvatarRight: HTMLButtonElement | null;

  closeCropModalBtn: HTMLButtonElement | null;

  closeCropModalCrossBtn: HTMLButtonElement | null | undefined;

  zoomAvatarCount: HTMLElement | null;

  alignAvatarCount: HTMLElement | null;

  saveCropBtn: HTMLButtonElement | null;

  avatarImages: string;

  avatarImagesNodeList: NodeList;

  cropper: Cropper | null;

  imgSrc: string;

  rotateAngle: number;

  isFirstInit: boolean;

  locationOrigin: string;

  callbackAfterImageUpload: (_img: string) => void;

  avatarImg: HTMLElement | null;

  constructor(avatarImages, callbackAfterImageUpload) {
    this.avatarImages = avatarImages;
    this.locationOrigin = window.location.origin;
    this.openAvatarBtns = document.querySelectorAll('.js-open-avatar-edit');
    this.avatarImg = document.querySelector('.js-avatar');
    this.addPhotoBtn = document.querySelector('.js-add-avatar');
    this.deletePhotoBtn = document.querySelector('.js-delete-avatar');
    this.cropPhotoBtn = document.querySelector('.js-crop-avatar');
    this.avatarImagesNodeList = document.querySelectorAll(
      `.${this.avatarImages}`
    );
    this.zoomAvatarSlider = document.querySelector('.js-zoom-avatar');
    this.alignAvatarSlider = document.querySelector('.js-align-avatar');
    this.rotateAvatarLeft = document.querySelector('.js-rotate-avatar-left');
    this.rotateAvatarRight = document.querySelector('.js-rotate-avatar-right');
    this.closeCropModalBtn = document.querySelector('.js-close-crop-modal');
    this.saveCropBtn = document.querySelector('.js-save-crop');
    this.alignAvatarCount = document.querySelector('.js-align-count');
    this.zoomAvatarCount = document.querySelector('.js-zoom-count');
    this.rotateAngle = 0;
    this.imgSrc = '';
    this.closeCropModalCrossBtn = document
      .querySelector('[data-modal="avatar-crop"]')
      ?.querySelector('.js-close-modal-btn');
    this.editAvatarModal = new CustomModal('avatar-edit');
    this.cropAvatarModal = new CustomModal('avatar-crop');
    this.previewAvatarModal = new CustomModal('avatar-preview');
    this.cropper = null;
    this.isFirstInit = true;
    this.callbackAfterImageUpload = callbackAfterImageUpload;
  }

  addPhoto(): void {
    this.addPhotoBtn?.addEventListener('change', (e?: Event) => {
      if (this.cropper) {
        this.cropper.destroy();
      }
      const target = e?.target;
      const file = (target as HTMLInputElement).files[0];

      const formData = new FormData();
      formData.append('file', file);

      axios
        .post(`${this.locationOrigin}/v2/api/files/upload`, formData)
        .then((response) => {
          this.avatarImagesNodeList.forEach((img) => {
            this.imgSrc = response.data.full;
            (img as Element).setAttribute('src', this.imgSrc);
          });
          this.callbackAfterImageUpload(this.imgSrc);
        });

      if (this.cropPhotoBtn) {
        this.cropPhotoBtn.disabled = false;
      }

      if (this.deletePhotoBtn) {
        this.deletePhotoBtn.disabled = false;
      }
    });
  }

  deletePhoto(): void {
    this.deletePhotoBtn?.addEventListener('click', () => {
      this.avatarImagesNodeList.forEach((img) => {
        URL.revokeObjectURL(this.imgSrc);
        (img as Element).removeAttribute('src');
      });
      this.avatarImagesNodeList.forEach((img) => {
        (img as Element).removeAttribute('src');
      });

      this.cropPhotoBtn!.disabled = true;
      this.deletePhotoBtn!.disabled = true;
      this.addPhotoBtn!.value = '';
      this.callbackAfterImageUpload('');
    });
  }

  cropPhoto(): void {
    this.cropPhotoBtn?.addEventListener('click', () => {
      this.zoomAvatarSlider!.value = '0';
      this.alignAvatarSlider!.value = '0';
      this.alignAvatarCount!.innerHTML = '0';
      this.zoomAvatarCount!.innerHTML = '0';
      this.rotateAngle = 0;
      this.editAvatarModal.close();
      this.cropAvatarModal.open();
      const cropImg: HTMLImageElement | null = document.querySelector(
        '.js-crop-avatar-img'
      );
      const self = this;
      this.cropper = new Cropper(cropImg as HTMLImageElement, {
        viewMode: 3,
        aspectRatio: 1,
        ready: () => {
          if (self.isFirstInit) {
            this.rotateAvatar();
            this.zoomAvatar();
            this.alignAvatar();
            this.saveCrop();
            self.isFirstInit = false;
          }
        },
      });
    });
  }

  openModal(): void {
    this.openAvatarBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (
          (this.avatarImagesNodeList[0] as HTMLImageElement).getAttribute(
            'src'
          ) ===
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
        ) {
          this.cropPhotoBtn!.disabled = true;
          this.deletePhotoBtn!.disabled = true;
        } else {
          this.cropPhotoBtn!.disabled = false;
          this.deletePhotoBtn!.disabled = false;
        }
        this.editAvatarModal.open();
      });
    });
  }

  closeCropModal(): void {
    this.closeCropModalBtn?.addEventListener('click', () => {
      this.cropAvatarModal.close();
      this.editAvatarModal.open();
      this.cropper?.destroy();
    });

    this.closeCropModalCrossBtn?.addEventListener('click', () => {
      this.cropper?.destroy();
    });
  }

  openPreviewAvatarModal(): void {
    this.avatarImg?.addEventListener('click', (e) => {
      if(e.target instanceof Element && !e.target.closest('.js-open-avatar-edit')) {
        this.previewAvatarModal?.open();
      }
    });
  }

  rotateAvatar() {
    this.rotateAvatarLeft?.addEventListener('click', () => {
      this.rotateAngle -= 90;
      this.cropper?.rotate(-90);
    });

    this.rotateAvatarRight?.addEventListener('click', () => {
      this.rotateAngle += 90;
      this.cropper?.rotate(90);
    });
  }

  saveCrop() {
    this.saveCropBtn?.addEventListener('click', () => {
      const cropData = this.cropper?.getData(true);
    });
  }

  zoomAvatar() {
    this.zoomAvatarSlider?.addEventListener('input', () => {
      const value = this.zoomAvatarSlider?.value;
      this.zoomAvatarCount!.innerHTML = value!;
      this.cropper?.zoomTo(Number(value));
    });
  }

  alignAvatar() {
    this.alignAvatarSlider?.addEventListener('input', () => {
      const value: string | undefined = this.alignAvatarSlider?.value;
      this.alignAvatarCount!.innerHTML = value!;
      const alignAngle = this.rotateAngle + Number(value);
      this.cropper?.rotateTo(alignAngle);
    });
  }

  init() {
    this.openPreviewAvatarModal();
    if (this.openAvatarBtns.length === 0 || !this.addPhoto) {
      return;
    }

    this.openModal();
    this.closeCropModal();
    this.addPhoto();
    this.cropPhoto();
    this.deletePhoto();
  }
}
export default AvatarEdit;
