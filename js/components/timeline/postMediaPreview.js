import ReadMore from '../../services/read-more';
import VideoPlayer from '../../services/videoPlayer';
import ClassSelect2 from '../class-select2';

class PostMediaPreview {
  constructor(post) {
    this.post = post;
    this.postUserAvatar = post.querySelector('.js-user-avatar-wrapper');
    this.postUserInfo = post.querySelector('.js-post-user-info').innerHTML;
    this.postTime = post.querySelector('.js-post-time').innerHTML;
    this.postStatistic = post.querySelector('.js-post-statistic').innerHTML;
    this.postActionsBtns = post.querySelector(
      '.js-post-actions-buttons'
    ).innerHTML;
    this.postText = post.querySelector('.js-post-text');
    this.postCommentsWrapper = post.querySelector(
      '.js-comments-block .js-comments-wrapper'
    );
    this.postCommentsAmount = post
      .querySelector('.js-comments-block')
      .getAttribute('data-comments');
    this.postMediaArray = Array.from(post.querySelectorAll('.js-post-media'));

    this.mediaItems = Array.from(
      post.querySelectorAll('.js-preview-media-btn')
    );
    this.previewPopup = document.querySelector('.js-media-preview-modal');
    this.previewUserAvatar = this.previewPopup.querySelector(
      '.js-media-preview-user-avatar'
    );
    this.previewUserInfo =
      this.previewPopup.querySelector('.js-post-user-info');
    this.previewPostTime = this.previewPopup.querySelector('.js-post-time');
    this.previewPostWrapper = this.previewPopup.querySelector(
      '.js-single-post-wrapper'
    );
    this.previewStatistic =
      this.previewPopup.querySelector('.js-post-statistic');
    this.previewActionsBtns = this.previewPopup.querySelector(
      '.js-post-actions-buttons'
    );
    this.previewCommentsListBlock = this.previewPopup.querySelector(
      '.js-comments-list-block'
    );
    // this.previewSorterOfComments = this.previewPopup.querySelector(
    //   '.js-comments-sorter'
    // );
    this.previewCommentsBlock =
      this.previewPopup.querySelector('.js-comments-block');
    this.previewCommentsWrapper = this.previewPopup.querySelector(
      '.js-comments-wrapper'
    );
    this.previewEmptyComments =
      this.previewPopup.querySelector('.js-empty-comments');
    this.previewCurrentMediaCount = this.previewPopup.querySelector(
      '.js-current-media-count'
    );
    this.previewTotalMediaCount = this.previewPopup.querySelector(
      '.js-total-media-count'
    );
    this.previewBody = this.previewPopup.querySelector('.js-post-body');
    this.previewTopBlock =
      this.previewPopup.querySelector('.js-post-top-block');
    this.previewText = this.previewPopup.querySelector('.js-post-text');
    this.previewPhoto = this.previewPopup.querySelector('.js-post-photo');
    this.previewVideo = this.previewPopup.querySelector('.js-post-video');
    this.previewVideoBlock = this.previewVideo.closest('video');
    this.previousBtn = this.previewPopup.querySelector('.js-previous-btn');
    this.nextBtn = this.previewPopup.querySelector('.js-next-btn');
    this.closeModalBtn = this.previewPopup.querySelector('.js-close-modal-btn');
    this.rotateLeftBtn = this.previewPopup.querySelector(
      '.js-rotate-left-button'
    );
    this.rotateRightBtn = this.previewPopup.querySelector(
      '.js-rotate-right-button'
    );
    this.previewMediaWrapper = this.previewPopup.querySelector(
      '.js-preview-media-wrapper'
    );
    this.previewWriteCommentWrapper = this.previewPopup.querySelector(
      '.js-write-comment-wrapper'
    );
    this.rotateLeftDegree = -90;
    this.rotateRightDegree = 90;
    this.counterOfClicks = 1;
    this.timelineUrl = window.location.href;
    this.currentMediaIndex = 0;
    this.deleteCommentBtns = [];
  }

  initPreviewPopup(media, index) {
    let mediaSrc;

    this.currentMediaIndex = index;
    this.previewCurrentMediaCount.innerHTML = (
      this.currentMediaIndex + 1
    ).toString();

    if (index < 4) {
      mediaSrc = media.getAttribute('src');
    } else if (index >= 4) {
      mediaSrc = media.getAttribute('data-src');
    }

    const mediaUrl = media.getAttribute('data-url');

    window.history.replaceState('', '', mediaUrl);

    const videoPlayer = new VideoPlayer();
    videoPlayer.init();
    const videoPlyr = this.previewPopup.querySelector('.plyr');

    if (media.classList.contains('js-post-photo')) {
      this.previewPhoto.setAttribute('src', mediaSrc);
      this.previewPhoto.setAttribute('data-index', index);
      this.previewPhoto.classList.add('is-visible');
      videoPlyr.classList.add('is-hidden');
      this.previousBtn.style.height = '100%';
      this.nextBtn.style.height = '100%';
    } else if (media.classList.contains('js-post-video')) {
      this.previewVideo.setAttribute('src', mediaSrc);
      this.previewVideo.setAttribute('data-index', index);
      this.previewPhoto.classList.remove('is-visible');
      videoPlyr.classList.remove('is-hidden');
      videoPlyr.querySelector('video').load();
      this.previousBtn.style.height = 'calc(100% - 45px)';
      this.nextBtn.style.height = 'calc(100% - 45px)';
    }

    this.previewCommentsBlock.setAttribute(
      'data-comments',
      this.postCommentsAmount
    );

    if (this.previewCommentsWrapper.innerHTML !== '') {
      this.previewCommentsWrapper.innerHTML = '';
    }

    if (this.previewText.innerHTML !== '') {
      this.previewText.innerHTML = '';
    }

    // if (this.previewSorterOfComments.classList.contains('is-hidden')) {
    //   this.previewSorterOfComments.classList.remove('is-hidden');
    // }

    this.previewUserAvatar.innerHTML = this.postUserAvatar.innerHTML;

    this.previewUserInfo.innerHTML = this.postUserInfo;

    this.previewPostTime.innerHTML = this.postTime;

    this.previewStatistic.innerHTML = this.postStatistic;

    this.previewActionsBtns.innerHTML = this.postActionsBtns;

    if (this.postText) {
      this.previewText.innerHTML = this.postText.innerHTML;
    }

    if (this.postCommentsWrapper.querySelector('.js-comment') !== null) {
      if (this.previewEmptyComments.classList.contains('is-visible')) {
        this.previewEmptyComments.classList.remove('is-visible');
      }

      this.previewCommentsListBlock.classList.add('is-visible');
      this.previewCommentsWrapper.innerHTML =
        this.postCommentsWrapper.innerHTML;
    } else {
      this.previewCommentsListBlock.classList.remove('is-visible');

      if (!this.previewEmptyComments.classList.contains('is-visible')) {
        this.previewEmptyComments.classList.add('is-visible');
      }
    }

    const readMoreTogglers = this.previewPopup.querySelectorAll(
      '.js-read-more-toggler'
    );
    if (readMoreTogglers.length !== 0) {
      readMoreTogglers.forEach((toggler) => {
        if (toggler.classList.contains('toggle-init')) {
          toggler.classList.remove('toggle-init');
        }
      });
    }
    new ReadMore().init();

    this.disableButtons();

    this.previewTotalMediaCount.innerHTML =
      this.postMediaArray.length.toString();
    this.previewCurrentMediaCount.innerHTML = (
      this.currentMediaIndex + 1
    ).toString();

    new ClassSelect2().init();

    // const comments = Array.from(
    //   this.previewPostWrapper.querySelectorAll('.js-comment')
    // );
    // const commentBlocks = Array.from(
    //   this.previewPostWrapper.querySelectorAll('.js-comment-block')
    // );
    // const commentsBlocks = Array.from(
    //   this.previewPostWrapper.querySelectorAll('.js-comments-block')
    // );
    const writeCommentBlocks = Array.from(
      this.previewPostWrapper.querySelectorAll('.js-write-comment-block')
    );

    const sendCommentBtn =
      writeCommentBlocks[writeCommentBlocks.length - 1].querySelector(
        '.js-textarea-btn'
      );
    sendCommentBtn.addEventListener('click', () => {
      this.addComment();
    });

    const deleteCommentBtnsArray = Array.from(
      this.previewPopup.querySelectorAll('.js-delete-comment')
    );
    deleteCommentBtnsArray.forEach((btn) => {
      this.deleteCommentBtns.push(btn);
    });

    this.deleteCommentBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.deleteComment();
      });
    });
  }

  deleteComment() {
    if (
      this.previewCommentsWrapper.querySelector('.js-comment') === null &&
      !this.previewCommentsWrapper
        .querySelector('.js-show-comments-btn')
        .classList.contains('is-visible')
    ) {
      this.previewCommentsListBlock.classList.remove('is-visible');
      this.previewEmptyComments.classList.add('is-visible');
    }
  }

  addComment() {
    if (this.previewCommentsWrapper.querySelector('.js-comment') !== null) {
      this.previewCommentsListBlock.classList.add('is-visible');
      this.previewEmptyComments.classList.remove('is-visible');
    }
  }

  getMedia(type) {
    let mediaSrc;
    // eslint-disable-next-line prefer-const
    let nextMedia;

    if (type === 'next') {
      this.currentMediaIndex += 1;
    } else if (type === 'prev') {
      this.currentMediaIndex -= 1;
    }

    this.disableButtons();

    // eslint-disable-next-line prefer-const
    nextMedia = this.postMediaArray[this.currentMediaIndex];

    if (nextMedia) {
      this.previewCurrentMediaCount.innerHTML = (
        this.currentMediaIndex + 1
      ).toString();

      if (this.currentMediaIndex < 4) {
        mediaSrc = nextMedia.getAttribute('src');
      } else if (this.currentMediaIndex >= 4) {
        mediaSrc = nextMedia.getAttribute('data-src');
      }

      const videoPlyr = this.previewPopup.querySelector('.plyr');

      if (nextMedia.classList.contains('js-post-photo')) {
        this.previewPhoto.setAttribute('src', mediaSrc);
        this.previewPhoto.setAttribute('data-index', this.currentMediaIndex);
        this.previewPhoto.classList.add('is-visible');
        videoPlyr.classList.add('is-hidden');
        this.previousBtn.style.height = '100%';
        this.nextBtn.style.height = '100%';
      } else if (nextMedia.classList.contains('js-post-video')) {
        this.previewVideo.setAttribute('src', mediaSrc);
        this.previewVideo.setAttribute('data-index', this.currentMediaIndex);
        this.previewVideo.closest('video').load();
        this.previewVideo.closest('video').controls = true;
        videoPlyr.classList.remove('is-hidden');
        this.previewPhoto.classList.remove('is-visible');
        this.previousBtn.style.height = 'calc(100% - 45px)';
        this.nextBtn.style.height = 'calc(100% - 45px)';
      }

      videoPlyr.querySelector('video').pause();

      const mediaUrl = nextMedia.getAttribute('data-url');

      window.history.replaceState('', '', mediaUrl);
    }

    this.previewMediaWrapper.style.transform = 'rotate(0deg)';
    this.counterOfClicks = 1;
  }

  disableButtons() {
    if (this.postMediaArray.length === 1) {
      this.previousBtn.classList.add('is-hidden');
      this.nextBtn.classList.add('is-hidden');
    } else {
      this.previousBtn.classList.remove('is-hidden');
      this.nextBtn.classList.remove('is-hidden');
    }

    if (this.currentMediaIndex === 0) {
      if (this.postMediaArray.length > 2) {
        this.previousBtn.classList.add('is-disabled');
      } else {
        this.previousBtn.classList.add('is-disabled');
        this.nextBtn.classList.remove('is-disabled');
      }
    } else if (this.currentMediaIndex === this.postMediaArray.length - 1) {
      if (this.postMediaArray.length > 2) {
        this.nextBtn.classList.add('is-disabled');
      } else {
        this.previousBtn.classList.remove('is-disabled');
        this.nextBtn.classList.add('is-disabled');
      }
    } else if (this.postMediaArray.length > 2) {
      if (this.previousBtn.classList.contains('is-disabled')) {
        this.previousBtn.classList.remove('is-disabled');
      }

      if (this.nextBtn.classList.contains('is-disabled')) {
        this.nextBtn.classList.remove('is-disabled');
      }
    }
  }

  rotateMediaToLeft() {
    this.previewMediaWrapper.style.transform = `rotate(${
      this.rotateLeftDegree * this.counterOfClicks
    }deg)`;
    this.counterOfClicks += 1;
  }

  rotateMediaToRight() {
    this.previewMediaWrapper.style.transform = `rotate(${
      this.rotateRightDegree * this.counterOfClicks
    }deg)`;
    this.counterOfClicks += 1;
  }

  setHeightOfCommentsBlock() {
    const scrollBlock = this.previewPopup.querySelector(
      '.js-media-preview-scroll-block'
    );
    if (window.innerWidth > 768) {
      const heightOfCommentsBlock =
        window.innerHeight -
        this.previewActionsBtns.offsetHeight -
        this.previewStatistic.offsetHeight -
        this.previewTopBlock.offsetHeight -
        this.previewBody.offsetHeight;

      const heightOfCommentsList =
        heightOfCommentsBlock -
        this.previewWriteCommentWrapper.offsetHeight -
        48;

      const heightOfScrollBlock =
        window.innerHeight - this.previewTopBlock.offsetHeight;
      scrollBlock.style.height = `${heightOfScrollBlock}px`;

      this.previewEmptyComments.style.height = `${heightOfCommentsList}px`;
    } else {
      this.previewCommentsBlock.style.height = `auto`;

      this.previewCommentsListBlock.style.height = `auto`;

      this.previewEmptyComments.style.height = `200px`;

      scrollBlock.style.height = `auto`;
    }
  }

  closeModal() {
    window.history.replaceState('', '', this.timelineUrl);
  }

  listeners() {
    this.previousBtn.addEventListener('click', () => {
      this.getMedia('prev');
    });

    this.nextBtn.addEventListener('click', () => {
      this.getMedia('next');
    });

    this.closeModalBtn.addEventListener('click', () => {
      this.closeModal();
    });

    this.rotateLeftBtn.addEventListener('click', () => {
      this.rotateMediaToLeft();
    });

    this.rotateRightBtn.addEventListener('click', () => {
      this.rotateMediaToRight();
    });

    window.addEventListener('resize', () => {
      this.setHeightOfCommentsBlock();
    });
  }

  init() {
    this.listeners();
  }
}

export default PostMediaPreview;
