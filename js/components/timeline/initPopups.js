import CustomModal from '../custom-modal';
import PostMediaPreview from './postMediaPreview';

const initPopups = () => {
  const postsWrapper = document.querySelector('.js-posts-wrapper');

  const shareToTimeline = new CustomModal('share-post-to-timeline');
  document.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('js-share-to-timeline') ||
      e.target.closest('.js-share-to-timeline')
    ) {
      shareToTimeline.open();
    }

    if (
      e.target.classList.contains('js-cancel-share-post-btn') ||
      e.target.closest('.js-cancel-share-post-btn')
    ) {
      shareToTimeline.close();
    }
  });

  const shareToSocials = new CustomModal('share-post-to-socials');
  document.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('js-share-to-socials') ||
      e.target.closest('.js-share-to-socials')
    ) {
      shareToSocials.open();
    }
  });

  const likesPreview = new CustomModal('likes-preview');
  document.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('js-likes-preview-btn') ||
      e.target.closest('.js-likes-preview-btn')
    ) {
      likesPreview.open();

      // eslint-disable-next-line no-unused-vars
      const postId = e.target.getAttribute('data-post-id');
      // ajax by postId to get data for popup
    }
  });

  const sharesPreview = new CustomModal('shares-preview');
  document.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('js-shares-stat') ||
      e.target.closest('.js-shares-stat')
    ) {
      sharesPreview.open();

      // eslint-disable-next-line no-unused-vars
      const postId = e.target.getAttribute('data-post-id');
      // ajax by postId to get data for popup
    }
  });

  const initMediaPreviewPopup = () => {
    const mediaPreview = new CustomModal('preview-media-modal');
    const mediaPreviewPopup = document.querySelector('.js-media-preview-modal');
    let newMediaPreview = null;
    const storage = {};
    let btn;

    postsWrapper.addEventListener('click', (e) => {
      const targetItem = e.target;

      if (
        targetItem.classList.contains('js-preview-media-btn') ||
        targetItem.closest('.js-preview-media-btn')
      ) {
        mediaPreview.open();

        if (targetItem.classList.contains('js-preview-media-btn')) {
          btn = targetItem;
        } else if (targetItem.closest('.js-preview-media-btn')) {
          btn = targetItem.closest('.js-preview-media-btn');
        }

        // eslint-disable-next-line no-unused-vars
        const postId = btn.getAttribute('data-post-id');
        // ajax by postId for obtain basic info about post for popup

        const post = btn.closest('.js-single-post-wrapper');
        const mediaItems = Array.from(
          post.querySelectorAll('.js-preview-media-btn')
        );

        const media = btn.querySelector('.js-post-media');
        const index = mediaItems.indexOf(btn);

        newMediaPreview = new PostMediaPreview(post);
        storage.instance = newMediaPreview;
        newMediaPreview.initPreviewPopup(media, index);
        newMediaPreview.setHeightOfCommentsBlock();
        newMediaPreview.init();
      }

      if (mediaPreviewPopup) {
        const closeMediaPreviewBtn = mediaPreviewPopup.querySelector(
          '.js-close-modal-btn'
        );

        closeMediaPreviewBtn.addEventListener('click', () => {
          delete storage.instance;
        });
      }
    });
  };
  initMediaPreviewPopup();

  const deletePost = new CustomModal('delete-post-modal');
  postsWrapper.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('js-delete-post-btn') ||
      e.target.closest('.js-delete-post-btn')
    ) {
      deletePost.open();
    }

    if (
      e.target.classList.contains('js-close-delete-post-popup') ||
      e.target.closest('.js-close-delete-post-popup')
    ) {
      deletePost.close();
    }

    if (
      e.target.classList.contains('js-delete-post') ||
      e.target.closest('.js-delete-post')
    ) {
      deletePost.close();
    }
  });
};

export default initPopups;
