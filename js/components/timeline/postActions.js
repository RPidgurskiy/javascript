import CharLimitsCounter from '../char-limits';
import PostCreation from './postCreation';

class PostActions {
  constructor(post) {
    this.post = post;
    this.postItem = post.querySelector('.js-post');
    this.postId = this.postItem.getAttribute('id');
    this.pinnedIcon = this.postItem.querySelector('.js-pinned-icon');
    this.pinPostBtn = this.postItem.querySelector('.js-pin-post-btn');
    this.editPostBtn = this.postItem.querySelector('.js-edit-post-btn');
    this.disableCommentsBtn = this.postItem.querySelector(
      '.js-disable-comments-btn'
    );
    this.deletePostBtn = this.postItem.querySelector('.js-delete-post-btn');
    this.deletePostBtnInModal = document.querySelector('.js-delete-post');
    this.likePostBtn = this.postItem.querySelector('.js-like-post-btn');
    this.postAuthorName = this.postItem.querySelector('.js-post-author-name');
    this.postAuthorAvatar = this.postItem.querySelector(
      '.js-user-avatar-wrapper'
    );
    this.postTime = this.postItem.querySelector('.js-post-time');
    this.postTextBlock = this.postItem.querySelector('.js-post-text');
    this.postInsertedContent = this.postItem.querySelector(
      '.js-post-inserted-content'
    );
    this.postPhotos = Array.from(
      this.postItem.querySelectorAll('.js-post-photo')
    );
    this.postVideos = Array.from(
      this.postItem.querySelectorAll('.js-post-video')
    );
    this.postInsertedLink = this.postItem.querySelector(
      '.js-post-inserted-link'
    );
    this.commentsBlock = this.postItem.querySelector('.js-comments-block');
    this.writeCommentTextarea = this.commentsBlock.querySelector(
      '.js-comment-textarea'
    );
    this.commentsStatBtn = this.postItem.querySelector('.js-comments-stat');
    this.toggleCommentsBtn = this.postItem.querySelector(
      '.js-toggle-comments-btn'
    );
    this.deletePostModal = document.querySelector('.js-delete-post-modal');

    this.editPostBlock = post.querySelector('.js-post-edit-block');
    if (this.editPostBlock) {
      this.editPostCreationBlock = this.editPostBlock.querySelector(
        '.js-edit-post-creation-block'
      );
      this.editPostTextBlock =
        this.editPostBlock.querySelector('.js-post-textarea');
      this.editPostMediaBlock = this.editPostBlock.querySelector(
        '.js-post-media-block'
      );
      this.defaultPhoto = this.editPostBlock.querySelector('.js-post-photo');
      this.defaultVideo = this.editPostBlock.querySelector('.js-post-video');
      this.editPostContentBlock =
        this.editPostBlock.querySelector('.js-post-content');
      this.counterOfSymbols = this.editPostBlock.querySelector(
        '.js-counter-wrapper'
      );
      this.cancelBtn = this.editPostBlock.querySelector('.js-close-edit-post');
      this.publishBtn = this.editPostBlock.querySelector(
        '.js-publish-post-btn'
      );
      this.settingsCheckboxes = Array.from(
        this.editPostBlock.querySelectorAll('.js-checkbox-setting-item')
      );
      this.editPostAuthorName = this.editPostBlock.querySelector(
        '.js-post-author-name'
      );
      this.editPostAuthorAvatar = this.editPostBlock.querySelector(
        '.js-edit-post-user-avatar'
      );
      this.editPostTime = this.editPostBlock.querySelector('.js-post-time');
    }

    this.hidePostBlock = post.querySelector('.js-hide-post-block');
    if (this.hidePostBlock) {
      this.hidePostBtn = post.querySelector('.js-hide-post-btn');
      this.undoHidePostBtn = this.hidePostBlock.querySelector(
        '.js-undo-hide-post-btn'
      );
    }
    this.photosSrcArray = [];
    this.videosSrcArray = [];
    this.photosArray = [];
    this.videosArray = [];
    this.addedMediaArray = [];
    this.storage = {};
  }

  editPost() {
    this.editPostAuthorName.innerHTML = this.postAuthorName.innerHTML;
    this.editPostAuthorAvatar.innerHTML = this.postAuthorAvatar.innerHTML;
    this.editPostTime.innerHTML = this.postTime.innerHTML;

    if (this.postInsertedContent) {
      const postContent = this.postInsertedContent.innerHTML;
      this.editPostContentBlock.insertAdjacentHTML('afterEnd', postContent);
    }

    if (this.postTextBlock && this.postTextBlock.textContent !== 0) {
      this.editPostTextBlock.value = this.postTextBlock.textContent.trim();
      const textWrapper = this.editPostTextBlock.closest(
        '.js-post-creation-text-block'
      );
      let height;

      const setHeight = () => {
        if (window.innerWidth > 1368) {
          height = (this.editPostTextBlock.value.length / 86) * 20 + 24;
        } else if (window.innerWidth > 1200) {
          height = (this.editPostTextBlock.value.length / 64) * 20 + 24;
        } else if (window.innerWidth > 768) {
          height = (this.editPostTextBlock.value.length / 52) * 20 + 24;
        } else if (window.innerWidth > 368) {
          height = (this.editPostTextBlock.value.length / 40) * 20 + 24;
        } else if (window.innerWidth > 0) {
          height = (this.editPostTextBlock.value.length / 30) * 20 + 24;
        }

        if (height < 40) {
          height = 20;
        }

        this.editPostTextBlock.style.height = `${height}px`;
      };

      setHeight();

      window.addEventListener('resize', () => {
        setHeight();
      });

      if (height >= 40) {
        textWrapper.classList.add('is-full');
      }
    }

    if (this.postPhotos.length !== 0) {
      let photoSrc;

      this.postPhotos.forEach((photo) => {
        if (photo.getAttribute('src') !== null) {
          photoSrc = photo.getAttribute('src');
        } else {
          photoSrc = photo.getAttribute('data-src');
        }

        this.photosSrcArray.push(photoSrc);
      });

      this.photosSrcArray.forEach((item) => {
        const photo = this.defaultPhoto.cloneNode(true);
        this.editPostMediaBlock.appendChild(photo);
        this.photosArray.push(photo);
        photo.querySelector('img').setAttribute('src', `${item}`);
        photo.classList.remove('is-hidden');
      });
    }

    if (this.postVideos.length !== 0) {
      let videoSrc;

      this.postVideos.forEach((video) => {
        if (video.getAttribute('src') !== null) {
          videoSrc = video.getAttribute('src');
        } else {
          videoSrc = video.getAttribute('data-src');
        }

        this.videosSrcArray.push(videoSrc);
      });

      this.videosSrcArray.forEach((item) => {
        const video = this.defaultVideo.cloneNode(true);
        this.editPostMediaBlock.appendChild(video);
        this.videosArray.push(video);
        video.querySelector('source').setAttribute('src', `${item}`);
        video.classList.remove('is-hidden');
      });
    }

    this.addedMediaArray = this.photosArray.concat(this.videosArray);

    if (this.addedMediaArray.length !== 0) {
      this.editPostContentBlock.classList.add('is-active');
    }

    this.settingsCheckboxes.forEach((item) => {
      const input = item.querySelector('input');
      const label = item.querySelector('label');
      const id = input.getAttribute('id');
      input.setAttribute('id', `${id}2`);
      input.setAttribute('name', `${id}2`);
      label.setAttribute('for', `${id}2`);
    });

    if (this.storage.instance === undefined) {
      this.storage.instance = new PostCreation(
        this.editPostCreationBlock,
        this.addedMediaArray
      );
      this.storage.instance.init();
    }

    new CharLimitsCounter(this.counterOfSymbols).init();

    this.postItem.classList.add('is-hidden');
    this.editPostBlock.classList.add('is-visible');

    this.deleteInsertedContent();
  }

  cancelEditPost() {
    const textarea =
      this.editPostCreationBlock.querySelector('.js-post-textarea');
    const loadedPhotos = Array.from(
      this.editPostCreationBlock.querySelectorAll('.js-post-photo')
    ).slice(1);
    const loadedVideos = Array.from(
      this.editPostCreationBlock.querySelectorAll('.js-post-video')
    ).slice(1);
    const insertedContent = this.editPostCreationBlock.querySelector(
      '.js-post-inserted-content-inner'
    );

    if (textarea.value.length !== 0) {
      textarea.value = '';
    }

    if (loadedPhotos.length !== 0) {
      loadedPhotos.forEach((photo) => {
        photo.remove();
      });
    }

    if (loadedVideos.length !== 0) {
      loadedVideos.forEach((video) => {
        video.remove();
      });
    }

    if (insertedContent) {
      insertedContent.remove();
    }

    this.photosSrcArray = [];
    this.videosSrcArray = [];
    this.photosArray = [];
    this.videosArray = [];
    this.addedMediaArray = [];

    delete this.storage.instance;
  }

  deleteInsertedContent = () => {
    const deleteBtns = document.querySelectorAll('.js-delete-inserted-btn');

    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const insertedContent = btn.closest('.js-post-inserted-content-inner');
        e.preventDefault();
        insertedContent.remove();
      });
    });
  };

  publishEditedPost() {
    // ajax for publish edited post

    this.postItem.classList.remove('is-hidden');
    this.editPostBlock.classList.remove('is-visible');
  }

  pinUnpinPost(e) {
    const postsWrapper = this.post.closest('.js-posts-wrapper');
    const pinnedPost = postsWrapper.querySelector('.js-post.is-pinned');

    if (this.post.classList.contains('is-pinned')) {
      this.post.classList.remove('is-pinned');
      this.pinnedIcon.classList.remove('is-visible');
      this.pinPostBtn
        .querySelector('.js-unpin-post-text')
        .classList.add('is-hidden');
      this.pinPostBtn
        .querySelector('.js-pin-post-text')
        .classList.remove('is-hidden');

      // ajax
    } else {
      if (pinnedPost) {
        const pinnedPostPinIcon = pinnedPost.querySelector('.js-pinned-icon');
        const pinnedPostPinPostBtn =
          pinnedPost.querySelector('.js-pin-post-btn');

        pinnedPost.classList.remove('is-pinned');
        pinnedPostPinIcon.classList.remove('is-visible');
        pinnedPostPinPostBtn
          .querySelector('.js-unpin-post-text')
          .classList.add('is-hidden');
        pinnedPostPinPostBtn
          .querySelector('.js-pin-post-text')
          .classList.remove('is-hidden');
      }

      this.post.classList.add('is-pinned');
      this.pinnedIcon.classList.add('is-visible');
      this.pinPostBtn
        .querySelector('.js-unpin-post-text')
        .classList.remove('is-hidden');
      this.pinPostBtn
        .querySelector('.js-pin-post-text')
        .classList.add('is-hidden');

      // ajax
    }

    e.target.closest('.js-dropdown').classList.remove('open');
  }

  disableEnableComments() {
    if (this.commentsBlock.classList.contains('is-hidden')) {
      this.commentsBlock.classList.remove('is-hidden');
      this.toggleCommentsBtn.classList.remove('is-off');
      this.commentsStatBtn.classList.remove('is-off');
      this.disableCommentsBtn
        .querySelector('.js-enable-com-text')
        .classList.add('is-hidden');
      this.disableCommentsBtn
        .querySelector('.js-disable-com-text')
        .classList.remove('is-hidden');

      // ajax
    } else {
      this.commentsBlock.classList.add('is-hidden');
      this.toggleCommentsBtn.classList.add('is-off');
      this.commentsStatBtn.classList.add('is-off');
      this.disableCommentsBtn
        .querySelector('.js-enable-com-text')
        .classList.remove('is-hidden');
      this.disableCommentsBtn
        .querySelector('.js-disable-com-text')
        .classList.add('is-hidden');

      // ajax
    }
  }

  toggleComments() {
    if (this.commentsBlock.classList.contains('is-hidden')) {
      this.commentsBlock.classList.remove('is-hidden');
      this.writeCommentTextarea.focus();
    } else {
      this.commentsBlock.classList.add('is-hidden');
    }
  }

  likeUnlikePost() {
    if (this.likePostBtn.classList.contains('is-active')) {
      this.likePostBtn.classList.remove('is-active');
      this.likePostBtn
        .querySelector('.js-like-post-text')
        .classList.remove('is-hidden');
      this.likePostBtn
        .querySelector('.js-is-liked-post-text')
        .classList.add('is-hidden');

      // ajax
    } else {
      this.likePostBtn.classList.add('is-active');
      this.likePostBtn
        .querySelector('.js-like-post-text')
        .classList.add('is-hidden');
      this.likePostBtn
        .querySelector('.js-is-liked-post-text')
        .classList.remove('is-hidden');

      // ajax
    }
  }

  deletePost() {
    const postId = this.deletePostModal.getAttribute('data-post');
    const postForDelete = document.getElementById(postId);

    if (postForDelete) {
      postForDelete.remove();
      // ajax
    }
  }

  hidePost() {
    this.postItem.classList.add('is-hidden');
    this.hidePostBlock.classList.remove('is-hidden');

    // ajax
  }

  undoHidePost() {
    this.postItem.classList.remove('is-hidden');
    this.hidePostBlock.classList.add('is-hidden');

    // ajax
  }

  listeners(e) {
    if (
      e.target.classList.contains('js-edit-post-btn') ||
      e.target.closest('.js-edit-post-btn')
    ) {
      this.cancelEditPost();
      this.editPost();
    }

    if (
      e.target.classList.contains('js-close-edit-post') ||
      e.target.closest('.js-close-edit-post')
    ) {
      this.editPostBlock.classList.remove('is-visible');
      this.postItem.classList.remove('is-hidden');
    }

    if (
      e.target.classList.contains('js-pin-post-btn') ||
      e.target.closest('.js-pin-post-btn')
    ) {
      this.pinUnpinPost(e);
    }

    if (
      e.target.classList.contains('js-disable-comments-btn') ||
      e.target.closest('.js-disable-comments-btn')
    ) {
      this.disableEnableComments();
    }

    if (
      e.target.classList.contains('js-toggle-comments-btn') ||
      e.target.closest('.js-toggle-comments-btn')
    ) {
      this.toggleComments(e);
    }

    if (
      e.target.classList.contains('js-like-post-btn') ||
      e.target.closest('.js-like-post-btn')
    ) {
      this.likeUnlikePost();
    }

    if (
      e.target.classList.contains('js-delete-post-btn') ||
      e.target.closest('.js-delete-post-btn')
    ) {
      this.deletePostModal.setAttribute('data-post', `${this.postId}`);
    }

    document.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('js-delete-post') ||
        event.target.closest('.js-delete-post')
      ) {
        this.deletePost();
      }
    });

    if (
      e.target.classList.contains('js-hide-post-btn') ||
      e.target.closest('.js-hide-post-btn')
    ) {
      this.hidePost();
    }

    if (
      e.target.classList.contains('js-undo-hide-post-btn') ||
      e.target.closest('.js-undo-hide-post-btn')
    ) {
      this.undoHidePost();
    }

    if (
      e.target.classList.contains('js-publish-post-btn') ||
      e.target.closest('.js-publish-post-btn')
    ) {
      this.publishEditedPost();
    }
  }

  init(e) {
    this.listeners(e);
  }
}

export default PostActions;
