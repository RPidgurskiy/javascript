import CustomModal from '../custom-modal';
import Snackbar from '../snackbar';

class PostCreation {
  constructor(postCreationBlock, addedMediaArray = []) {
    this.postCreationBlock = postCreationBlock;
    this.postTextBlock = postCreationBlock.querySelector(
      '.js-post-creation-text-block'
    );
    this.postTextarea = postCreationBlock.querySelector('.js-post-textarea');
    this.charactersLimit = postCreationBlock.querySelector(
      '.js-characters-limit'
    );
    this.postContentBlock = postCreationBlock.querySelector('.js-post-content');
    this.postMediaBlock = postCreationBlock.querySelector(
      '.js-post-media-block'
    );
    this.addPhotoInput = postCreationBlock.querySelector('.js-add-photo-input');
    this.photoItem = postCreationBlock.querySelector('.js-post-photo');
    this.photoImage = this.photoItem.querySelector('img');
    this.addVideoInput = postCreationBlock.querySelector('.js-add-video-input');
    this.videoItem = postCreationBlock.querySelector('.js-post-video');
    this.videoTag = this.videoItem.querySelector('video');
    this.sourceTag = this.videoTag.querySelector('source');
    this.fetchedLink = postCreationBlock.querySelector('.js-post-fetched-url');
    this.fetchedArticleLink = postCreationBlock.querySelector(
      '.js-post-fetched-url.js-post-fetched-article'
    );
    this.fetchedVideoLink = postCreationBlock.querySelector(
      '.js-post-fetched-url.js-post-fetched-video'
    );
    this.postActions = postCreationBlock.querySelector(
      '.js-post-creation-actions'
    );
    this.publishPostBtn = postCreationBlock.querySelector(
      '.js-publish-post-btn'
    );
    this.writePostBtn = document.querySelector('.js-write-post');
    this.progressBar = postCreationBlock.querySelector('.js-post-progress-bar');
    this.progressPercent = this.progressBar.querySelector(
      '.js-progress-percent'
    );
    this.progressLine = this.progressBar.querySelector('.js-progress-line');
    this.addedMediaArray = addedMediaArray;
    this.deleteMediaBtns = [];
    this.errorAddedMediaModal = new CustomModal('error-added-media-modal');
    this.errorAddedMediaModalBlock = document.querySelector(
      '.js-error-added-media-modal'
    );
    if (this.errorAddedMediaModalBlock) {
      this.continueAddMediaBtn = this.errorAddedMediaModalBlock.querySelector(
        '.js-continue-add-media'
      );
      this.cancelAddMediaBtn = this.errorAddedMediaModalBlock.querySelector(
        '.js-close-error-added-media-modal'
      );
    }
    this.errorMediaSnackbar = new Snackbar();
    this.validationMediaError = null;
  }

  togglePostActionsBlock() {
    if (
      this.postCreationBlock.classList.contains('js-no-toggle-post-actions')
    ) {
      this.postActions.classList.add('is-active');
      return;
    }

    this.postTextarea.addEventListener('focus', () => {
      this.postCreationBlock.classList.add('is-active');
      this.postActions.classList.add('is-active');

      if (
        this.addedMediaArray.length > 0 ||
        this.postContentBlock.querySelector(
          '.js-post-inserted-content.is-visible'
        )
      ) {
        this.postContentBlock.classList.add('is-active');
      }
    });

    document.addEventListener('click', (event) => {
      if (
        event.target.closest('.js-post-creation-block') === null &&
        !event.target.closest('.js-delete-media-btn') &&
        !event.target.closest('.js-delete-link-btn') &&
        !event.target.closest('.js-error-added-media-modal')
      ) {
        this.postCreationBlock.classList.remove('is-active');
        this.postActions.classList.remove('is-active');

        if (this.postContentBlock.classList.contains('is-active')) {
          this.postContentBlock.classList.remove('is-active');
        }
      }
    });
  }

  displayCharactersLimit() {
    if (this.postTextarea.value.length > 0) {
      this.charactersLimit.classList.add('is-visible');
    } else {
      this.charactersLimit.classList.remove('is-visible');
    }
  }

  changeTextareaHeight() {
    this.postTextarea.style.height = `${this.postTextarea.scrollHeight}px`;

    if (this.postTextarea.value.length > 0) {
      this.postTextBlock.classList.add('is-active');
    } else {
      this.postTextBlock.classList.remove('is-active');
    }

    if (this.postTextarea.value.length > 25) {
      this.postTextBlock.classList.add('is-full');
    } else {
      this.postTextBlock.classList.remove('is-full');
      this.postTextarea.style.height = '20px';
    }
  }

  addMedia = (type, event, self) => {
    const media = Array.from(event.target.files);
    const mediaCount = media.length;

    const insertMedia = () => {
      media.forEach((item, index) => {
        let newMedia;
        const selectedFile = event.target.files[index];
        const mediaType = selectedFile.type;
        const mediaSize = selectedFile.size;

        if (self.addedMediaArray.length === 10) {
          return;
        }

        this.validationMediaError = null;

        this.validateMedia(mediaType, mediaSize);

        if (this.validationMediaError === false) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(selectedFile);

          if (type === 'photo') {
            newMedia = self.photoItem.cloneNode(true);
          } else if (type === 'video') {
            newMedia = self.videoItem.cloneNode(true);
          }

          newMedia.classList.remove('is-hidden');
          self.addedMediaArray.push(newMedia);

          self.postMediaBlock.appendChild(newMedia);

          reader.onload = (e) => {
            const mediaBlob = new Blob([e.target.result], {
              type: 'video/mp4, image/jpeg, image/png',
            });
            const url = window.URL.createObjectURL(mediaBlob);

            if (type === 'photo') {
              newMedia.querySelector('img').src = url;
              newMedia.title = selectedFile.name;
            } else if (type === 'video') {
              newMedia.querySelector('source').src = url;
              const id = e.target.result.byteLength;

              newMedia.querySelector('video').id = `video-${id}`;
              newMedia.querySelector('video').load();
            }
          };
        }
      });

      this.changeMediaClass();

      const insertedLink = self.postContentBlock.querySelector(
        '.js-post-fetched-url.is-visible'
      );
      if (insertedLink) {
        insertedLink.classList.remove('is-visible');
      }

      this.postContentBlock.classList.add('is-active');
      this.deleteMedia();
      this.changeVideoCover();
      this.changePublishBtnStatus();
    };

    if (mediaCount > 10 || self.addedMediaArray.length + mediaCount > 10) {
      this.errorAddedMediaModal.open();

      this.continueAddMediaBtn.addEventListener('click', () => {
        this.errorAddedMediaModal.close();
        insertMedia();
      });

      this.cancelAddMediaBtn.addEventListener('click', () => {
        this.errorAddedMediaModal.close();
      });
    } else {
      insertMedia();
    }
  };

  initAddMedia() {
    const self = this;

    if (!this.addPhotoInput.classList.contains('is-inited')) {
      this.addPhotoInput.classList.add('is-inited');

      this.addPhotoInput.addEventListener('change', (event) => {
        self.addMedia('photo', event, self);
      });
    }

    if (!this.addVideoInput.classList.contains('is-inited')) {
      this.addVideoInput.classList.add('is-inited');

      this.addVideoInput.addEventListener('change', (event) => {
        self.addMedia('video', event, self);
      });
    }
  }

  validateMedia = (mediaType, mediaSize) => {
    let maxFileSize;

    if (
      mediaType.indexOf('image') !== -1 &&
      mediaType !== 'image/jpeg' &&
      mediaType !== 'image/png'
    ) {
      this.errorMediaSnackbar.addMessage(
        'danger',
        'Invalid file format. Image should be max size 15 MB and valid formats - jpg, png.',
        'Error loading media',
        'Got it'
      );
      this.validationMediaError = true;
    } else if (
      mediaType.indexOf('video') !== -1 &&
      mediaType !== 'video/mp4' &&
      mediaType !== 'video/quicktime'
    ) {
      this.errorMediaSnackbar.addMessage(
        'danger',
        'Invalid file format. Video should be max size 100 MB and valid formats - mp4.',
        'Error loading media',
        'Got it'
      );
      this.validationMediaError = true;
    } else {
      this.validationMediaError = false;
    }

    if (this.validationMediaError === false) {
      if (mediaType === 'image/jpeg' || mediaType === 'image/png') {
        maxFileSize = 15 * 1024 * 1024; // 15MB
      } else if (mediaType === 'video/mp4' || mediaType === 'video/quicktime') {
        maxFileSize = 100 * 1024 * 1024; // 100MB
      }

      if (
        mediaSize > maxFileSize &&
        (mediaType === 'image/jpeg' || mediaType === 'image/png')
      ) {
        this.errorMediaSnackbar.addMessage(
          'danger',
          'Invalid file format. Image should be max size 15 MB and valid formats - jpg, png.',
          'Error loading media',
          'Got it'
        );
        this.validationMediaError = true;
      } else if (
        mediaSize > maxFileSize &&
        (mediaType === 'video/mp4' || mediaType === 'video/quicktime')
      ) {
        this.errorMediaSnackbar.addMessage(
          'danger',
          'Invalid file format. Video should be max size 100 MB and valid formats - mp4.',
          'Error loading media',
          'Got it'
        );
        this.validationMediaError = true;
      } else {
        this.validationMediaError = false;
      }
    }
  };

  deleteMedia() {
    let deleteMediaBtns = Array.from(
      this.postCreationBlock.querySelectorAll('.js-delete-media-btn')
    );

    deleteMediaBtns.splice(0, 2);

    this.deleteMediaBtns = deleteMediaBtns;

    this.deleteMediaBtns.forEach((btn) => {
      const initDeleteMedia = () => {
        const media = btn.closest('div');
        media.remove();

        const indexOfMedia = this.addedMediaArray.indexOf(media);
        if (indexOfMedia > -1) {
          this.addedMediaArray.splice(indexOfMedia, 1);
        }

        this.addInsertedLink(this);

        this.toggleEmptyContent();

        this.changePublishBtnStatus();

        this.changeMediaClass();

        deleteMediaBtns = Array.from(
          this.postCreationBlock.querySelectorAll('.js-delete-media-btn')
        );
        this.deleteMediaBtns = deleteMediaBtns;
      };

      btn.removeEventListener('click', initDeleteMedia, true);
      btn.addEventListener('click', initDeleteMedia);
    });
  }

  changeMediaClass() {
    const mediaAmount = this.postMediaBlock.querySelectorAll(
      '.js-post-photo, .js-post-video'
    ).length;

    if (mediaAmount === 4) {
      if (this.postMediaBlock.classList.contains('is-three-more-media')) {
        this.postMediaBlock.classList.remove('is-three-more-media');
      }

      this.postMediaBlock.classList.add('is-two-media');
    } else if (mediaAmount > 4) {
      if (this.postMediaBlock.classList.contains('is-two-media')) {
        this.postMediaBlock.classList.remove('is-two-media');
      }

      this.postMediaBlock.classList.add('is-three-more-media');
    } else {
      if (this.postMediaBlock.classList.contains('is-three-more-media')) {
        this.postMediaBlock.classList.remove('is-three-more-media');
      }

      if (this.postMediaBlock.classList.contains('is-two-media')) {
        this.postMediaBlock.classList.remove('is-two-media');
      }
    }
  }

  changeVideoCover = () => {
    this.addedMediaArray.forEach((mediaItem) => {
      const addCover = mediaItem.querySelector('.js-add-cover-btn');
      const deleteCover = mediaItem.querySelector('.js-remove-cover-btn');
      let urlOfCover;

      if (addCover) {
        addCover.addEventListener('click', () => {
          addCover.value = '';

          addCover.addEventListener('change', (e) => {
            const selectedCover = e.target.files[0];

            URL.revokeObjectURL(urlOfCover);
            urlOfCover = URL.createObjectURL(selectedCover);
            mediaItem.querySelector('video').setAttribute('poster', urlOfCover);
            deleteCover.classList.remove('hidden');
          });
        });
      }

      if (deleteCover) {
        deleteCover.addEventListener('click', () => {
          mediaItem.querySelector('video').setAttribute('poster', ``);
          deleteCover.classList.add('hidden');
          URL.revokeObjectURL(urlOfCover);
        });
      }
    });
  };

  addInsertedLink = (self) => {
    if (self.addedMediaArray.length === 0 && self.postTextarea.value !== 0) {
      const textOfPost = self.postTextarea.value;
      const regEx =
        // eslint-disable-next-line no-useless-escape
        /(((https?:\/\/)|(www\.))[^\s]+)/g;

      if (textOfPost && textOfPost.match(regEx)) {
        // eslint-disable-next-line no-unused-vars
        const link = textOfPost.match(regEx)[0];

        // ajax request for adding js-post-fetched-url block
        if (
          link &&
          (link.indexOf('https://blockster.com/blockademy') !== -1 ||
            link.indexOf('https://blockster.com/blockdesk') !== -1)
        ) {
          if (this.fetchedLink.classList.contains('is-visible')) {
            this.fetchedLink.classList.remove('is-visible');
          }
          if (this.fetchedVideoLink.classList.contains('is-visible')) {
            this.fetchedVideoLink.classList.remove('is-visible');
          }
          this.fetchedArticleLink.classList.add('is-visible');
          this.postContentBlock.classList.add('is-active');
        } else if (link.indexOf('https://www.youtube.com/') !== -1) {
          if (this.fetchedLink.classList.contains('is-visible')) {
            this.fetchedLink.classList.remove('is-visible');
          }
          if (this.fetchedArticleLink.classList.contains('is-visible')) {
            this.fetchedArticleLink.classList.remove('is-visible');
          }
          this.fetchedVideoLink.classList.add('is-visible');
          this.postContentBlock.classList.add('is-active');
        } else if (link) {
          if (this.fetchedArticleLink.classList.contains('is-visible')) {
            this.fetchedArticleLink.classList.remove('is-visible');
          }
          this.fetchedLink.classList.add('is-visible');
          this.postContentBlock.classList.add('is-active');
        }
      }
    }
  };

  deleteInsertedLink = (self) => {
    const insertedLink = self.postContentBlock.querySelector(
      '.js-post-fetched-url.is-visible'
    );

    if (insertedLink) {
      const deleteInsertedLinkBtn = insertedLink.querySelector(
        '.js-delete-link-btn'
      );

      deleteInsertedLinkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        insertedLink.remove();
        self.togglePostActionsBlock();
      });
    }
  };

  initInsertedLink() {
    const self = this;

    if (self.postCreationBlock.classList.contains('js-edit-post-block')) {
      self.addInsertedLink(self);
    }

    self.postTextarea.addEventListener('input', () => {
      self.addInsertedLink(self);
      self.deleteInsertedLink(self);
      self.toggleEmptyContent();
    });
  }

  toggleEmptyContent() {
    const mediaCount = this.postCreationBlock.querySelectorAll(
      '.js-post-photo, .js-post-video'
    );

    if (
      mediaCount.length === 2 &&
      !this.postContentBlock.querySelector('.js-post-fetched-url.is-visible')
    ) {
      this.postContentBlock.classList.remove('is-active');
      this.postActions.classList.add('is-active');
    }
  }

  changePublishBtnStatus() {
    let insertedContent;

    insertedContent = this.postContentBlock.querySelector(
      '.js-post-inserted-content.is-visible'
    );

    if (
      this.postCreationBlock.classList.contains('js-edit-post-creation-block')
    ) {
      insertedContent = this.postCreationBlock.querySelector(
        '.js-post-inserted-content.is-visible'
      );
    }

    if (
      this.addedMediaArray.length === 0 &&
      this.postTextarea.value.length === 0 &&
      insertedContent === null
    ) {
      this.publishPostBtn.disabled = true;
    } else if (
      this.addedMediaArray.length > 0 ||
      this.postTextarea.value.length !== 0 ||
      insertedContent !== null
    ) {
      this.publishPostBtn.disabled = false;
    }
  }

  changeTextareaPlaceholder() {
    if (this.postCreationBlock.offsetWidth <= 500) {
      this.postTextarea.setAttribute('placeholder', 'What`s going on?');
    } else {
      this.postTextarea.setAttribute(
        'placeholder',
        'What`s going on?  #Hashtag  @Mention.. Link..'
      );
    }
  }

  sendPost() {
    // ajax request which insert new post into timeline
    const xhr = new XMLHttpRequest();
    const src = '';
    const loadedPhotos = this.postCreationBlock
      .querySelectorAll('.js-post-photo')
      .slice(1, -1);
    const loadedVideos = this.postCreationBlock
      .querySelectorAll('.js-post-video')
      .slice(1, -1);
    const insertedLink = this.postCreationBlock.querySelector(
      '.js-post-fetched-url.is-visible'
    );

    xhr.open('get', src, true);
    xhr.send();

    xhr.onerror = () => {
      // console.log('Error');
    };

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const complete = Math.round((event.loaded / event.total) * 100);
        this.progressPercent.textContent = `${complete}`;
        this.progressBar.classList.add('is-active');
        this.progressLine.style.cssText = `width: ${complete}%`;
      }
    };

    xhr.onload = () => {
      this.progressBar.classList.remove('is-active');
      this.progressPercent.textContent = '';
      this.progressLine.style.cssText = '';
      this.postTextarea.value = '';
      this.addedMediaArray = [];
      if (loadedPhotos) {
        loadedPhotos.remove();
      }
      if (loadedVideos) {
        loadedVideos.remove();
      }
      if (insertedLink) {
        insertedLink.classList.remove('is-visible');
      }
    };
  }

  initSendPost() {
    this.postCreationBlock.addEventListener('submit', this.sendPost);
  }

  listeners() {
    this.postTextarea.addEventListener('input', () => {
      this.changeTextareaHeight();
      this.displayCharactersLimit();
      this.changePublishBtnStatus();
    });

    window.addEventListener('resize', () => {
      this.changeTextareaPlaceholder();
    });

    if (this.writePostBtn) {
      this.writePostBtn.addEventListener('click', () => {
        this.postTextarea.focus();
      });
    }
  }

  init() {
    try {
      this.togglePostActionsBlock();
      this.initAddMedia();
      this.deleteMedia();
      if (
        this.postCreationBlock.classList.contains('js-edit-post-creation-block')
      ) {
        this.changeMediaClass();
      }
      this.changeVideoCover();
      this.initInsertedLink();
      this.changeTextareaPlaceholder();
      this.initSendPost();
      this.listeners();

      this.errorAddedMediaModal.init();
    } catch (e) {
      // console.log(e);
    }
  }
}

export default PostCreation;
