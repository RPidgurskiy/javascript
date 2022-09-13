import axios from 'axios';

import VideoPlayer from '../services/videoPlayer';
import CustomModal from './custom-modal';
import Snackbar from './snackbar';

const IMAGE_FORMATS = ['jpg', 'png', 'jpeg'];
const VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'quicktime', 'wmv', 'mpeg4', 'ogv'];

class AddVideo {
  btn: HTMLButtonElement;

  callbackFunction: Function;

  addVideoModal: CustomModal;

  imageModal: CustomModal;

  // eslint-disable-next-line no-undef
  switchTabsBtns: NodeListOf<HTMLLinkElement>;

  // eslint-disable-next-line no-undef
  tabsContent: NodeListOf<HTMLDivElement>;

  dropVideoArea: HTMLDivElement | null;

  dropImageArea: HTMLDivElement | null;

  // eslint-disable-next-line no-undef
  dropAreas: NodeListOf<HTMLDivElement>;

  uploadVideoInput: HTMLInputElement | null;

  uploadYoutubeVideoInput: HTMLInputElement | null;

  progressContainer: HTMLDivElement | null;

  openImageModalBtn: HTMLButtonElement | null;

  deleteVideoBtn: HTMLButtonElement | null;

  deleteImageBtn: HTMLButtonElement | null;

  // eslint-disable-next-line no-undef
  editImageBtn: NodeListOf<HTMLButtonElement> | null;

  player: VideoPlayer | null;

  backToUploadBtn: HTMLButtonElement | null;

  imagePreview: HTMLImageElement | null;

  imagePreviewURL: string | null;

  videoPreviewURL: string | null;

  defaultImageSrc: string | null;

  imageUploadInput: HTMLInputElement | null;

  submitBtn: HTMLButtonElement | null;

  formDataVideo: FormData;

  formDataCover: FormData;

  fetchUrl: string;

  pasteVideoLinkInput: HTMLInputElement | null;

  videoAddedByLinkWrapper: HTMLDivElement | null;

  clearInputBtn: HTMLButtonElement | null;

  videoLink: string | null;

  videoCoverLink: string | null;

  chooseVideoBtn: HTMLButtonElement | null;

  eventClick: Event;

  errorSnackbar: Snackbar;

  constructor(
    btn: HTMLButtonElement,
    fetchUrl: string,
    callbackFunction: () => void
  ) {
    this.btn = btn;
    this.fetchUrl = fetchUrl;
    this.callbackFunction = callbackFunction;
    this.addVideoModal = new CustomModal('upload-video');
    this.imageModal = new CustomModal('upload-img');
    this.switchTabsBtns = document.querySelectorAll('.js-switch-tab-btn');
    this.tabsContent = document.querySelectorAll('.js-tab-content');
    this.dropVideoArea = document.querySelector('.js-add-video-drop-area');
    this.dropImageArea = document.querySelector('.js-add-image-drop-area');
    this.dropAreas = document.querySelectorAll('.js-drop-area');
    this.uploadVideoInput = document.querySelector('.js-upload-video-input');
    this.uploadYoutubeVideoInput = document.querySelector(
      '.js-youtube-video-hidden-input'
    );
    this.progressContainer = document.querySelector(
      '.js-upload-progress-container'
    );
    this.openImageModalBtn = document.querySelector('.js-open-image-modal');
    this.deleteVideoBtn = document.querySelector('.js-remove-video');
    this.player = null;
    this.backToUploadBtn = document.querySelector('.js-back-to-upload');
    this.imagePreview = document.querySelector('.js-image-preview');
    this.imagePreviewURL = null;
    this.videoPreviewURL = null;
    this.defaultImageSrc = null;
    this.editImageBtn = document.querySelectorAll('.js-edit-image');
    this.deleteImageBtn = document.querySelector('.js-remove-image');
    this.imageUploadInput = document.querySelector('.js-upload-image-input');
    this.submitBtn = document.querySelector('.js-submit-video');
    this.formDataVideo = new FormData();
    this.formDataCover = new FormData();
    this.pasteVideoLinkInput = document.querySelector('.js-paste-input');
    this.videoAddedByLinkWrapper = document.querySelector(
      '.js-added-video-by-link-wrapper'
    );
    this.clearInputBtn = document.querySelector('.js-clear-btn');
    this.videoLink = null;
    this.videoCoverLink = null;
    this.chooseVideoBtn = document.querySelector('.js-choose-video');
    this.eventClick = new Event('click');
    this.errorSnackbar = new Snackbar();
  }

  checkVideoFormat(files) {
    const type = files ? files[0].type.split('/')[1].toLowerCase() : '';
    const size = files ? files[0].size / 1024 / 1024 : '';

    if (VIDEO_FORMATS.indexOf(type) !== -1 && size <= 15) {
      this.handleVideoUpload(files);
    } else {
      this.errorSnackbar.addMessage(
        'error',
        'Please check the requirements of video uploading. Video length should be up to 60 minutes. Max video size is 15 MB. Required video format: MP4, AVI, MOV, WMV, MPEG4, OGV'
      );
    }
  }

  checkImageFormat(files) {
    const type = files ? files[0].type.split('/')[1].toLowerCase() : '';
    const size = files ? files[0].size / 1024 / 1024 : '';

    if (IMAGE_FORMATS.indexOf(type) !== -1 && size <= 15) {
      this.handleImageUpload(files);
    } else {
      this.errorSnackbar.addMessage(
        'error',
        'Please check the requirements of image uploading. Max image size is 15 MB. Required image format: JPEG, PNG'
      );
    }
  }

  dragAndDropGlobal() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      this.dropVideoArea?.addEventListener(
        eventName,
        this.preventDefaults,
        false
      );
      this.dropImageArea?.addEventListener(
        eventName,
        this.preventDefaults,
        false
      );
      document.body.addEventListener(eventName, this.preventDefaults, false);
    });

    this.dropAreas.forEach((area) => {
      area?.addEventListener(
        'drop',
        (e) => {
          e.preventDefault();
          const dt = e.dataTransfer;
          const files = dt?.files;
          if (area.classList.contains('js-add-video-drop-area')) {
            this.checkVideoFormat(files);
          }
          if (area.classList.contains('js-add-image-drop-area')) {
            this.checkImageFormat(files);
          }
        },
        false
      );
    });
  }

  removeVideo() {
    this.deleteVideoBtn?.addEventListener('click', (e: MouseEvent) => {
      e.stopImmediatePropagation();
      this.openImageModalBtn!.disabled = true;
      this.dropVideoArea!.classList.remove('content-uploaded');
      this.dropVideoArea!.querySelector(
        '.add-video-modal__drop-area-inner'
      )!.innerHTML = '';
      this.dropVideoArea?.addEventListener('click', this.fakeClickOnDropArea);
      this.uploadVideoInput!.value = '';
      if (this.videoPreviewURL) {
        URL.revokeObjectURL(this.videoPreviewURL);
      }
      this.formDataVideo.delete('file');
      this.validateNextStepBtn();
    });
  }

  makeVideoBlob(file) {
    const videoData = [];
    videoData.push(file[0] as never);
    this.videoPreviewURL = URL.createObjectURL(
      new Blob(videoData, { type: 'video' })
    );
  }

  makeImageBlob(file) {
    const imageData = [];
    imageData.push(file as never);
    this.imagePreviewURL = URL.createObjectURL(
      new Blob(imageData, { type: 'image' })
    );
  }

  handleVideoUpload(file) {
    this.makeVideoBlob(file);
    this.formDataVideo.append('file', file[0]);
    this.dropVideoArea?.removeEventListener('click', this.fakeClickOnDropArea);
    this.dropVideoArea!.querySelector(
      '.add-video-modal__drop-area-inner'
    )!.innerHTML = this.videoMarkup(this.videoPreviewURL);
    this.dropVideoArea!.classList.add('content-uploaded');

    const video: HTMLVideoElement | null =
      document.querySelector('#uploadedVideo');

    this.player = new VideoPlayer(video);
    this.player.init();

    this.openImageModalBtn!.disabled = false;
  }

  handleImageUpload(file) {
    this.makeImageBlob(file[0]);
    this.formDataCover.append('file', file[0]);
    if (this.imagePreviewURL) {
      this.imagePreview?.setAttribute('src', this.imagePreviewURL);
    }
    this.dropImageArea?.classList.add('content-uploaded');
  }

  removeImage() {
    this.deleteImageBtn?.addEventListener('click', () => {
      if (this.defaultImageSrc) {
        this.imagePreview?.setAttribute('src', this.defaultImageSrc);
      }
      this.dropImageArea?.classList.remove('content-uploaded');
      this.imageUploadInput!.value = '';
      if (this.imagePreviewURL) {
        URL.revokeObjectURL(this.imagePreviewURL);
      }
      this.formDataCover.delete('file');
    });
  }

  editImage() {
    this.editImageBtn?.forEach((btn) => {
      btn.addEventListener('click', () => {
        const input: HTMLInputElement | null = document.querySelector(
          '.js-upload-image-input'
        );
        input?.click();
      });
    });
  }

  uploadImage() {
    this.imageUploadInput?.addEventListener('change', () => {
      if (this.imageUploadInput?.files) {
        this.checkImageFormat(this.imageUploadInput?.files);
      }
    });
  }

  uploadYoutubeVideo(fullLink, trimmedLink) {
    if (this.videoAddedByLinkWrapper) {
      const videoAddedByLinkSrc: HTMLDivElement | null = document.querySelector(
        '.js-added-video-by-link-src'
      );

      videoAddedByLinkSrc?.setAttribute('data-plyr-embed-id', trimmedLink);
      videoAddedByLinkSrc?.classList.add('js-video');

      this.player = new VideoPlayer(videoAddedByLinkSrc);
      this.player.init();

      this.videoAddedByLinkWrapper.classList.remove('hidden');
      this.videoAddedByLinkWrapper.classList.add('is-inited');
      this.uploadYoutubeVideoInput!.value = fullLink;
      this.openImageModalBtn!.disabled = false;
    }
  }

  resetYoutubeVideoBlock() {
    if (this.videoAddedByLinkWrapper!.querySelector('.plyr')) {
      this.videoAddedByLinkWrapper!.classList.add('hidden');
      this.videoAddedByLinkWrapper!.classList.remove('is-inited');
      const videoPlayer = `<div id="uploadedVideo2" class="js-added-video-by-link-src" data-plyr-provider="youtube" data-plyr-embed-id=""></div>`;
      const videoPlayerForInsert = document
        .createRange()
        .createContextualFragment(videoPlayer);
      this.videoAddedByLinkWrapper!.querySelector('.plyr')?.remove();
      this.videoAddedByLinkWrapper!.appendChild(videoPlayerForInsert);
      const videoAddedByLinkSrc: HTMLDivElement | null = document.querySelector(
        '.js-added-video-by-link-src'
      );
      videoAddedByLinkSrc!.setAttribute('data-plyr-embed-id', '');
      this.uploadYoutubeVideoInput!.value = '';
      this.validateNextStepBtn();
    }
  }

  validateNextStepBtn() {
    if (this.uploadYoutubeVideoInput!.value || this.uploadVideoInput!.value) {
      this.openImageModalBtn!.disabled = false;
    } else {
      this.openImageModalBtn!.disabled = true;
    }
  }

  clearYoutubeInput() {
    this.pasteVideoLinkInput!.value = '';
    this.pasteVideoLinkInput!.focus();
  }

  resetFullVideoPopup() {
    this.clearYoutubeInput();
    this.resetYoutubeVideoBlock();
    this.imagePreview?.setAttribute('src', '');
    this.removeVideo();
    this.removeImage();
    this.deleteImageBtn?.dispatchEvent(this.eventClick);
    this.deleteVideoBtn?.dispatchEvent(this.eventClick);
    this.switchTabsBtns[0].classList.add('active');
    this.switchTabsBtns[1].classList.remove('active');
    this.tabsContent[0].classList.add('active');
    this.tabsContent[1].classList.remove('active');
    this.progressContainer?.classList.remove('active');
  }

  videoMarkup = (src) => `
        <video id="uploadedVideo" class="js-video" playsinline style="height:100%; width: 100%">
          <source src="${src}" type="video/mp4">
      </video>
    `;

  fakeClickOnDropArea = () => {
    this.uploadVideoInput!.click();
  };

  preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  switchTabs() {
    this.switchTabsBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('href');

        this.switchTabsBtns.forEach((item) => {
          item.classList.remove('active');
        });
        this.tabsContent.forEach((tab) => {
          tab.classList.remove('active');
          const tabName = tab.dataset.tab;
          if (tabName === target) {
            tab.classList.add('active');
          }
        });

        btn.classList.add('active');

        if (target === '#linkTab') {
          this.deleteVideoBtn?.dispatchEvent(this.eventClick);
        } else {
          this.resetYoutubeVideoBlock();
          this.clearYoutubeInput();
        }
      });
    });
  }

  submit() {
    let request = axios.CancelToken.source();

    const cancelUploadBtn: HTMLButtonElement | null =
      document.querySelector('.js-cancel-upload');

    const submitVideoCover = () => {
      if (this.formDataCover.get('file') !== null) {
        axios
          .post(this.fetchUrl, this.formDataCover)
          .then((response2) => {
            if (response2.data.full !== null) {
              this.videoCoverLink = response2.data.full;
            } else {
              this.videoCoverLink = null;
            }

            this.callbackFunction(this.videoLink, this.videoCoverLink);
          })
          .catch((error) => {
            if (axios.isCancel(error)) {
              request = axios.CancelToken.source();
            }
          });
      } else {
        this.videoCoverLink = null;
        this.callbackFunction(this.videoLink, this.videoCoverLink);
      }
    };

    this.submitBtn?.addEventListener('click', () => {
      this.progressContainer?.classList.add('active');

      if (this.formDataVideo.get('file') !== null) {
        axios
          .post(this.fetchUrl, this.formDataVideo, {
            onUploadProgress: (progressEvent) => {
              const progress = Math.floor(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              const progressLine: HTMLDivElement | null =
                document.querySelector('.js-progress-line');
              const progressNum: HTMLSpanElement | null =
                document.querySelector('.js-progress-num');
              progressLine!.style.width = `${progress}%`;
              progressNum!.innerHTML = `${progress}`;
            },
            cancelToken: request.token,
          })
          .then((response) => {
            this.imageModal.close();

            if (response.data.full !== null) {
              this.videoLink = response.data.full;
            } else {
              this.videoLink = null;
            }

            submitVideoCover();
          });
      } else {
        const progressLine: HTMLDivElement | null =
          document.querySelector('.js-progress-line');
        const progressNum: HTMLSpanElement | null =
          document.querySelector('.js-progress-num');
        progressLine!.style.width = `100%`;
        progressNum!.innerHTML = `100`;

        if (this.uploadYoutubeVideoInput!.value) {
          this.videoLink = this.uploadYoutubeVideoInput!.value;
        }

        this.imageModal.close();

        submitVideoCover();
      }
    });

    cancelUploadBtn?.addEventListener('click', () => {
      request.cancel();
      this.progressContainer?.classList.remove('active');
    });
  }

  listeners() {
    this.btn.addEventListener('click', () => {
      this.addVideoModal.open();
    });

    this.dropVideoArea?.addEventListener('click', this.fakeClickOnDropArea);
    this.dragAndDropGlobal();

    this.uploadVideoInput?.addEventListener('change', () => {
      if (!this.uploadVideoInput?.files) {
        return;
      }
      const file = this.uploadVideoInput?.files;

      this.checkVideoFormat(file);
    });

    this.switchTabs();
    this.removeVideo();

    this.openImageModalBtn?.addEventListener('click', () => {
      this.addVideoModal.close();
      this.imageModal.open();
    });

    this.backToUploadBtn?.addEventListener('click', () => {
      this.imageModal.close();
      this.deleteImageBtn?.dispatchEvent(this.eventClick);
      this.imagePreview?.setAttribute('src', '');
      this.addVideoModal.open();
    });

    this.removeImage();
    this.editImage();
    this.uploadImage();

    this.submit();

    this.pasteVideoLinkInput?.addEventListener('input', () => {
      const fullLink = this.pasteVideoLinkInput!.value;
      let trimmedLink;

      if (fullLink.indexOf('https://youtu.be') !== -1) {
        const index = fullLink.lastIndexOf('/');
        trimmedLink = fullLink.slice(index + 1);
      } else if (fullLink.indexOf('https://www.youtube.com') !== -1) {
        const index1 = fullLink.indexOf('&list');

        if (index1 !== -1) {
          const trimmedLinkMediate = fullLink.slice(0, index1);
          const index2 = trimmedLinkMediate.indexOf('v=');
          trimmedLink = trimmedLinkMediate.slice(index2 + 2);
        } else {
          const index2 = fullLink.indexOf('v=');
          trimmedLink = fullLink.slice(index2 + 2);
        }
      }

      if (
        this.pasteVideoLinkInput!.value.length > 0 &&
        (this.pasteVideoLinkInput!.value.indexOf('https://youtu.be') !== -1 ||
          this.pasteVideoLinkInput!.value.indexOf('https://www.youtube.com') !==
            -1) &&
        !this.videoAddedByLinkWrapper!.classList.contains('is-inited')
      ) {
        this.uploadYoutubeVideo(fullLink, trimmedLink);
      }

      if (
        this.pasteVideoLinkInput!.value.length === 0 ||
        (this.pasteVideoLinkInput!.value.indexOf('https://youtu.be') === -1 &&
          this.pasteVideoLinkInput!.value.indexOf('https://www.youtube.com') ===
            -1)
      ) {
        this.resetYoutubeVideoBlock();
      }
    });

    this.clearInputBtn?.addEventListener('click', () => {
      this.clearYoutubeInput();
      this.resetYoutubeVideoBlock();
    });

    this.chooseVideoBtn?.addEventListener('click', () => {
      this.resetFullVideoPopup();
    });
  }

  init() {
    if (!this.btn) {
      return;
    }
    this.listeners();
  }
}

export default AddVideo;
