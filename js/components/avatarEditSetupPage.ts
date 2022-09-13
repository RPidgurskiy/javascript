import axios from 'axios';
import Cropper from 'cropperjs';

import CustomModal from './custom-modal';

class AvatarEditSetupPage {
  openAvatarBtns: NodeList;

  editAvatarModal: CustomModal;

  cropAvatarModal: CustomModal;

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

  avatarImg: NodeList;

  profileImg: HTMLImageElement | null;

  cropper: Cropper | null;

  imgSrc: string;

  rotateAngle: number;

  isFirstInit: boolean;

  locationOrigin: string;

  callbackAfterImageUpload: (_img: string) => void;

  callbackOnUpload: () => void;

  callbackAfterUpload: () => void;

  userId: string;

  userIdInput: HTMLInputElement | null;

  constructor(callbackAfterImageUpload?, callbackOnUpload?, callbackAfterUpload?) {
    this.locationOrigin = window.location.origin;
    this.openAvatarBtns = document.querySelectorAll('.js-open-avatar-edit');
    this.addPhotoBtn = document.querySelector('.js-add-avatar');
    this.deletePhotoBtn = document.querySelector('.js-delete-avatar');
    this.cropPhotoBtn = document.querySelector('.js-crop-avatar');
    this.avatarImg = document.querySelectorAll('.js-avatar-img');
    this.profileImg = document.querySelector('.b-avatar__img');
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
    this.cropper = null;
    this.isFirstInit = true;
    this.callbackAfterImageUpload = callbackAfterImageUpload;
    this.callbackOnUpload = callbackOnUpload;
    this.callbackAfterUpload = callbackAfterUpload;
    this.userIdInput = document.querySelector('.js-user-id-input');
    if (this.userIdInput) {
      this.userId = this.userIdInput.value;
    }
  }

  addPhoto(): void {
    this.addPhotoBtn?.addEventListener('change', (e?: Event) => {
      if (this.cropper) {
        this.cropper.destroy();
      }
      const target: EventTarget = e?.target;
      const file = (target as HTMLInputElement).files[0];
      const fileData = new FormData();
      fileData.append('avatar', file);

      this.callbackOnUpload();
      axios.post(`${window.location.origin}/requests.php?f=update_user_avatar_picture`, fileData).then(res => {
        this.callbackAfterUpload();
        this.avatarImg.forEach((img) => {
          (img as HTMLImageElement).dataset.path = res.data.avatar_full
        })

        if (!this.cropPhotoBtn) {
          this.cropPhoto();
        }
      })
      // Here fetch to upload photo, if status succeed
      this.avatarImg.forEach((img) => {
        const data = [];
        data.push(file as never);

        this.imgSrc = URL.createObjectURL(new Blob(data));

        (img as Element).setAttribute('src', this.imgSrc);
      });
      if (this.deletePhotoBtn && this.cropPhotoBtn) {
        this.cropPhotoBtn.disabled = false;
        this.deletePhotoBtn.disabled = false;
      }

    });
  }

  deletePhoto(): void {
    this.deletePhotoBtn?.addEventListener('click', () => {
      this.avatarImg.forEach((img) => {
        URL.revokeObjectURL(this.imgSrc);
        (img as Element).removeAttribute('src');
      });
      this.avatarImg.forEach((img) => {
        (img as Element).removeAttribute('src');
      });
      (this.profileImg as Element).removeAttribute('src');

      this.cropPhotoBtn!.disabled = true;
      this.deletePhotoBtn!.disabled = true;
      this.addPhotoBtn!.value = '';
      this.callbackAfterImageUpload('');
    });
  }

  cropPhoto(): void {
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
  }

  openModal(): void {
    this.openAvatarBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (
          this.profileImg?.getAttribute('src') ===
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
      if (this.addPhotoBtn) {
        this.addPhotoBtn.value = '';
      }
    });

    this.closeCropModalCrossBtn?.addEventListener('click', () => {
      this.cropper?.destroy();
      if (this.addPhotoBtn) {
        this.addPhotoBtn.value = '';
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
      const formData = new FormData();
      const hashIdInput = document.querySelector('.js-hash-id-input');
      const hashId = hashIdInput ? (hashIdInput as HTMLInputElement).value : ''
      formData.append('user_id', this.userId)
      formData.append('hash_id', hashId)
      formData.append('path', (this.avatarImg[0] as HTMLImageElement).dataset.path)
      formData.append('x', `${cropData.x}`)
      formData.append('y', `${cropData.y}`)
      formData.append('width', `${cropData.width}`)
      formData.append('height', `${cropData.height}`)
      this.callbackOnUpload()
      axios.post(`${window.location.origin}/requests.php?f=crop-avatar&react_register=1`, formData).then(res => {
        this.callbackAfterUpload()
      })
      this.cropAvatarModal.close();
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

  listeners() {
    this.cropPhotoBtn?.addEventListener('click', () => {
      this.cropPhoto();
    });
  }

  init() {
    if (this.openAvatarBtns.length === 0 && !this.addPhotoBtn) {
      return;
    }

    this.openModal();
    this.closeCropModal();
    this.addPhoto();
    this.deletePhoto();
    this.listeners();
  }
}
export default AvatarEditSetupPage;
