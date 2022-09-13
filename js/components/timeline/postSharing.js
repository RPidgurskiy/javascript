import ReadMore from '../../services/read-more';
import CharLimitsCounter from '../char-limits';

class PostSharing {
  constructor(post) {
    this.post = post;
    this.sharePopup = document.querySelector('.js-share-to-timeline-popup');
    this.postUrl = post.getAttribute('data-url');
    this.postAuthorAvatar = post.querySelector('.js-user-avatar-wrapper');
    this.postAuthorName = post.querySelector('.js-post-author-name').innerHTML;
    this.postAuthorUrl = post
      .querySelector('.js-post-author-name')
      .getAttribute('href');
    this.postTime = post.querySelector('.js-post-time').innerHTML;
    this.sharesAmountBlock = post.querySelector('.js-shares-stat');
    this.sharesAmount = post.querySelector('.js-shares-amount');
    this.postBodyContent = post.querySelector('.js-post-body').innerHTML;
    this.shareToSocialsBtn = post.querySelector('.js-share-to-socials');
    this.shareToTimelineBtn = post.querySelector('.js-share-to-timeline');
    this.shareToSocialsPopup = document.querySelector(
      '.js-share-post-to-socials-modal'
    );
    if (this.shareToSocialsPopup) {
      this.shareToSocialsLinks = Array.from(
        this.shareToSocialsPopup.querySelectorAll('.js-share-to-socials-link')
      );
      this.shareToSocialsBtns = Array.from(
        this.shareToSocialsPopup.querySelectorAll('.js-share-to-socials-item')
      );
      this.defaultSocialsLinks = [
        'https://twitter.com/intent/tweet?text=',
        'https://www.facebook.com/sharer/sharer.php?u=',
        'https://www.linkedin.com/shareArticle?mini=true&url=',
        'https://pinterest.com/pin/create/button/?url=',
        'https://api.whatsapp.com/send?text=',
        'https://telegram.me/share/url?url=',
      ];
    }
    this.sharedPostAuthorAvatar = this.sharePopup.querySelector(
      '.js-shared-post-author-avatar'
    );
    this.sharedPostAuthorName = this.sharePopup.querySelector(
      '.js-shared-post-author-name'
    );
    this.sharedPostTime = this.sharePopup.querySelector('.js-shared-post-time');
    this.widerBtn = this.sharePopup.querySelector('.js-shared-post-wider-btn');
    this.narrowBtn = this.sharePopup.querySelector(
      '.js-shared-post-narrow-btn'
    );
    this.sharedPostBody = this.sharePopup.querySelector('.js-shared-post-body');
    this.radioShareToTimeline = this.sharePopup.querySelector(
      '.js-share-to-timeline-radio'
    );
    this.radioShareToGroup = this.sharePopup.querySelector(
      '.js-share-to-group-radio'
    );
    this.radioShareToPage = this.sharePopup.querySelector(
      '.js-share-to-page-radio'
    );
    this.sharePopupSelectBlock = this.sharePopup.querySelector(
      '.js-share-select-block'
    );
    this.pageSelect = this.sharePopup.querySelector(
      '.js-shared-post-page-select'
    );
    this.groupSelect = this.sharePopup.querySelector(
      '.js-shared-post-group-select'
    );
    this.selectTitle = this.sharePopup.querySelector('.js-select-title');
    this.sharedPostTextCounterWrapper = this.sharePopup.querySelector(
      '.js-counter-wrapper'
    );
    this.publishSharedPostBtn = this.sharePopup.querySelector(
      '.js-publish-shared-post-btn'
    );
    this.sharedPostAddedText =
      this.sharePopup.querySelector('.js-post-textarea');
    this.sharedPostTextBlock = this.sharePopup.querySelector(
      '.js-post-creation-text-block'
    );
    this.sharedPostMediaWrapper = '';
    this.sharedPostInsertedLink = '';
  }

  sharePostToSocials() {
    this.shareToSocialsLinks.forEach((link, index) => {
      link.setAttribute(
        'href',
        `${this.defaultSocialsLinks[index]}${this.postUrl}`
      );
    });
  }

  cancelSharePostToSocials() {
    this.shareToSocialsLinks.forEach((link, index) => {
      link.setAttribute('href', this.defaultSocialsLinks[index]);
    });
  }

  sharePostToTimeline() {
    this.sharedPostAuthorName.innerHTML = this.postAuthorName;
    this.sharedPostAuthorName.setAttribute('href', this.postAuthorUrl);
    this.sharedPostAuthorAvatar.innerHTML = this.postAuthorAvatar.innerHTML;
    this.sharedPostTime.innerHTML = this.postTime;
    this.sharedPostTime.setAttribute('href', this.postUrl);
    this.sharedPostBody.innerHTML = this.postBodyContent;

    const readMoreToggler = this.sharePopup.querySelector(
      '.js-read-more-toggler'
    );
    if (readMoreToggler) {
      if (readMoreToggler.classList.contains('toggle-init')) {
        readMoreToggler.classList.remove('toggle-init');
      }
      new ReadMore().init();
    }

    this.sharedPostMediaWrapper = this.sharePopup.querySelector(
      '.js-post-media-wrapper'
    );
    this.sharedPostInsertedLink = this.sharePopup.querySelector(
      '.js-post-inserted-link'
    );

    if (this.sharedPostMediaWrapper) {
      this.sharedPostMediaWrapper.classList.add('is-hidden');
      this.sharedPostMediaWrapper.style.height = '0';

      const mediaArray = this.sharedPostMediaWrapper.querySelectorAll(
        '.js-preview-media-btn'
      );
      const imageCount =
        this.sharedPostMediaWrapper.querySelector('.js-image-count');
      let imageCountFull;
      let imageCountMob;

      if (imageCount) {
        imageCountFull = `+${parseInt(imageCount.innerHTML, 10)}`;
        imageCountMob = `+${parseInt(imageCount.innerHTML, 10) + 1}`;
      }

      const setSharedMediaCount = () => {
        if (window.innerWidth < 768 && mediaArray.length >= 4) {
          if (mediaArray[2]) {
            mediaArray[2].classList.add('hidden');
          }
          if (imageCount) {
            imageCount.innerHTML = imageCountMob;
          }
        } else {
          if (mediaArray[2]) {
            mediaArray[2].classList.remove('hidden');
          }
          if (imageCount) {
            imageCount.innerHTML = imageCountFull;
          }
        }
      };

      setSharedMediaCount();
      window.addEventListener('resize', setSharedMediaCount);
    }

    if (this.sharedPostInsertedLink) {
      this.sharedPostInsertedLink.classList.add('is-hidden');
    }
  }

  cancelSharePostToTimeline() {
    this.sharePopupSelectBlock.classList.remove('is-visible');
    this.pageSelect.classList.remove('is-visible');
    this.groupSelect.classList.remove('is-visible');
    this.radioShareToTimeline.querySelector('input').checked = true;
    this.sharedPostAddedText.value = '';
    this.widerBtn.classList.remove('is-hidden');
    this.narrowBtn.classList.add('is-hidden');
    new CharLimitsCounter(this.sharedPostTextCounterWrapper).initCounter();
  }

  changeTextareaHeight() {
    this.sharedPostAddedText.style.height = `${this.sharedPostAddedText.scrollHeight}px`;

    if (this.sharedPostAddedText.value.length > 25) {
      this.sharedPostTextBlock.classList.add('is-full');
    } else {
      this.sharedPostTextBlock.classList.remove('is-full');
      this.sharedPostAddedText.style.height = '20px';
    }
  }

  wideSharedPost() {
    this.widerBtn.classList.add('is-hidden');
    this.narrowBtn.classList.remove('is-hidden');

    if (this.sharedPostMediaWrapper) {
      this.sharedPostMediaWrapper.classList.remove('is-hidden');
      this.sharedPostMediaWrapper.style.height = '';
    }

    if (this.sharedPostInsertedLink) {
      this.sharedPostInsertedLink.classList.remove('is-hidden');
    }
  }

  narrowSharedPost() {
    this.widerBtn.classList.remove('is-hidden');
    this.narrowBtn.classList.add('is-hidden');

    if (this.sharedPostMediaWrapper) {
      this.sharedPostMediaWrapper.classList.add('is-hidden');
      this.sharedPostMediaWrapper.style.height = '0';
    }

    if (this.sharedPostInsertedLink) {
      this.sharedPostInsertedLink.classList.add('is-hidden');
    }
  }

  shareToPage() {
    if (!this.sharePopupSelectBlock.classList.contains('is-visible')) {
      this.sharePopupSelectBlock.classList.add('is-visible');
    }

    if (!this.pageSelect.classList.contains('is-visible')) {
      this.pageSelect.classList.add('is-visible');
    }

    if (this.groupSelect.classList.contains('is-visible')) {
      this.groupSelect.classList.remove('is-visible');
    }

    this.selectTitle.innerHTML = 'Page';
  }

  shareToGroup() {
    if (!this.sharePopupSelectBlock.classList.contains('is-visible')) {
      this.sharePopupSelectBlock.classList.add('is-visible');
    }

    if (this.pageSelect.classList.contains('is-visible')) {
      this.pageSelect.classList.remove('is-visible');
    }

    if (!this.groupSelect.classList.contains('is-visible')) {
      this.groupSelect.classList.add('is-visible');
    }

    this.selectTitle.innerHTML = 'Group';
  }

  shareToTimeline() {
    if (this.sharePopupSelectBlock.classList.contains('is-visible')) {
      this.sharePopupSelectBlock.classList.remove('is-visible');
    }
  }

  changeCountOfShares() {
    const sharesAmountCount = parseInt(this.sharesAmount.innerHTML, 10);
    const newSharesAmountCount = sharesAmountCount + 1;

    if (this.sharesAmountBlock.classList.contains('is-hidden')) {
      this.sharesAmountBlock.classList.remove('is-hidden');
    }

    this.sharesAmount.innerHTML = newSharesAmountCount;
  }

  publishSharedPost() {
    // ajax for publish shared post

    this.changeCountOfShares();
  }

  listenersFirst() {
    this.shareToSocialsBtn.addEventListener('click', () => {
      this.cancelSharePostToSocials();
      this.sharePostToSocials();
    });

    this.shareToTimelineBtn.addEventListener('click', () => {
      this.cancelSharePostToTimeline();
      this.sharePostToTimeline();
    });
  }

  listenersSecond() {
    this.widerBtn.addEventListener('click', () => {
      this.wideSharedPost();
    });

    this.narrowBtn.addEventListener('click', () => {
      this.narrowSharedPost();
    });

    this.radioShareToPage.addEventListener('click', () => {
      this.shareToPage();
    });

    this.radioShareToGroup.addEventListener('click', () => {
      this.shareToGroup();
    });

    this.radioShareToTimeline.addEventListener('click', () => {
      this.shareToTimeline();
    });

    this.publishSharedPostBtn.addEventListener('submit', () => {
      this.publishSharedPost();
    });

    this.shareToSocialsBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.changeCountOfShares();
      });
    });

    this.sharedPostAddedText.addEventListener('input', () => {
      this.changeTextareaHeight();
    });
  }

  init() {
    try {
      this.listenersFirst();
      this.listenersSecond();
    } catch (e) {
      // console.log(e);
    }
  }
}

export default PostSharing;
