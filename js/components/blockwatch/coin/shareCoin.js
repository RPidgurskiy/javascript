import 'select2';

import $ from 'jquery';

import Snackbar from '../../snackbar';

class ShareCoin {
  constructor() {
    this.shareCoinToTimelinePopup = document.querySelector(
      '.js-share-coin-to-timeline-popup'
    );
    this.shareCoinToSocialsPopup = document.querySelector(
      '.js-share-coin-to-socials-modal'
    );
    this.shareToSocialsBtn = document.querySelector(
      '.js-share-coin-to-socials-btn'
    );
    this.copyLinkBtn = document.querySelector('.js-copy-link');
    this.defaultSocialsLinks = [
      'https://twitter.com/intent/tweet?text=',
      'https://www.facebook.com/sharer/sharer.php?u=',
      'https://www.linkedin.com/sharing/share-offsite/?url=',
      'https://pinterest.com/pin/create/button/?url=',
      'https://api.whatsapp.com/send?text=',
      'https://telegram.me/share/url?url=',
    ];

    if (this.shareCoinToSocialsPopup) {
      this.shareToSocialsLinks = Array.from(
        this.shareCoinToSocialsPopup.querySelectorAll(
          '.js-share-to-socials-link'
        )
      );
    }

    if (this.shareCoinToTimelinePopup) {
      this.radioShareToTimeline = this.shareCoinToTimelinePopup.querySelector(
        '.js-share-to-timeline-radio'
      );
      this.radioShareToPage = this.shareCoinToTimelinePopup.querySelector(
        '.js-share-to-page-radio'
      );
      this.sharePopupSelectBlock = this.shareCoinToTimelinePopup.querySelector(
        '.js-share-select-block'
      );
      this.pageSelect = this.shareCoinToTimelinePopup.querySelector(
        '.js-shared-post-page-select'
      );

      this.counterWrapper = this.shareCoinToTimelinePopup.querySelector(
        '.js-counter-wrapper'
      );
      this.textarea =
        this.shareCoinToTimelinePopup.querySelector('.js-post-textarea');
      this.textBlock = this.shareCoinToTimelinePopup.querySelector(
        '.js-post-creation-text-block'
      );
      this.publishSharedCoinBtn = this.shareCoinToTimelinePopup.querySelector(
        '.js-publish-shared-coin-btn'
      );
      this.counter = this.shareCoinToTimelinePopup.querySelector(
        '.js-characters-limit'
      );
      this.countOfUserPagesInput = this.shareCoinToTimelinePopup.querySelector(
        '.js-user-pages-count'
      );
      if (this.countOfUserPagesInput) {
        this.countOfUserPages = this.countOfUserPagesInput.value;
      }
      this.userIdInput =
        this.shareCoinToTimelinePopup.querySelector('.js-user-id');
      if (this.userIdInput) {
        this.userId = this.userIdInput.value;
      }
      this.pageIdInput = document.querySelector('.js-page-id');
      if (this.pageIdInput) {
        this.pageId = this.pageIdInput.value;
      }
      this.pageIdInputForShare = document.querySelector(
        '.js-page-id-for-share'
      );
      if (this.pageIdInputForShare) {
        this.pageIdForShare = this.pageIdInputForShare.value;
      }
      this.shareCoinSnackbar = new Snackbar();
      this.defaultPrivacySelects =
        this.shareCoinToTimelinePopup.querySelectorAll(
          '.c-post-creation-block__select'
        );
      if (this.defaultPrivacySelects) {
        // eslint-disable-next-line prefer-destructuring
        this.defaultPrivacySelectForTimeline = this.defaultPrivacySelects[0];
        // eslint-disable-next-line prefer-destructuring
        this.defaultPrivacySelectForPages = this.defaultPrivacySelects[1];
      }
      this.customPrivacySelects = [];
      this.customPrivacySelectForTimeline = null;
      this.customPrivacySelectForPages = null;
    }

    this.openShareToTimelinePopupBtn = document.querySelector(
      '.js-share-coin-to-timeline-btn'
    );
    this.locationOrigin = window.location.origin;
  }

  shareCoinToSocials() {
    const coinUrl = this.shareCoinToSocialsPopup.getAttribute('data-url');

    this.shareToSocialsLinks.forEach((link, index) => {
      link.setAttribute('href', `${this.defaultSocialsLinks[index]}${coinUrl}`);
    });
  }

  cancelShareCoinToSocials() {
    this.shareToSocialsLinks.forEach((link, index) => {
      link.setAttribute('href', this.defaultSocialsLinks[index]);
    });
  }

  changeTextareaHeight() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;

    if (this.textarea.value.length > 15) {
      this.textBlock.classList.add('is-full');
    } else {
      this.textBlock.classList.remove('is-full');
      this.textarea.style.height = '20px';
    }
  }

  changeTextareaPlaceholder() {
    if (window.innerWidth < 768) {
      this.textarea.setAttribute('placeholder', 'What`s going on?');
    } else {
      this.textarea.setAttribute(
        'placeholder',
        'What`s going on?  #Hashtag  @Mention.. Link..'
      );
    }
  }

  resetPopupData() {
    if (this.shareCoinToTimelinePopup.querySelector('#share-my-timeline')) {
      this.shareCoinToTimelinePopup.querySelector(
        '#share-my-timeline'
      ).checked = true;
    }
    this.textarea.value = '';
    this.counter.innerHTML = '5000';
    this.counter.classList.remove('is-error');
    this.publishSharedCoinBtn.removeAttribute('disabled');
    this.shareCoinToTimelinePopup.querySelector('#comments').checked = false;
    this.shareCoinToTimelinePopup.querySelector(
      '#notifications'
    ).checked = false;
    $('.js-chose-page-select').val(null).trigger('change');
    $(this.defaultPrivacySelectForPages).val('everyone').trigger('change');
    $(this.defaultPrivacySelectForTimeline).val('everyone').trigger('change');
    this.sharePopupSelectBlock.classList.remove('is-visible');
    this.publishSharedCoinBtn.classList.remove('js-share-to-page');

    this.customPrivacySelects = this.shareCoinToTimelinePopup.querySelectorAll(
      '.select2-container--default'
    );
    // eslint-disable-next-line prefer-destructuring
    this.customPrivacySelectForTimeline = this.customPrivacySelects[1];
    // eslint-disable-next-line prefer-destructuring
    this.customPrivacySelectForPages = this.customPrivacySelects[2];
    this.customPrivacySelectForPages.classList.add('hidden');
    this.customPrivacySelectForTimeline.classList.remove('hidden');
  }

  setSharedPageInfo() {
    fetch(`${this.locationOrigin}/v2/api/coins/${this.pageId}`)
      .then((response) => response.json())
      .then((data) => {
        const avatarSrc = data.page.avatar;
        const coverSrc = data.page.cover;
        const nameOfCoin = data.name;
        const descOfCoin = data.page.description;
        const isFollowed = data.page.followed;

        const coverBlock = this.shareCoinToTimelinePopup.querySelector(
          '.js-cover-shared-coin'
        );
        const avatarBlock = this.shareCoinToTimelinePopup.querySelector(
          '.js-avatar-shared-coin'
        );
        const nameBlock = this.shareCoinToTimelinePopup.querySelector(
          '.js-name-shared-coin'
        );
        const descBlock = this.shareCoinToTimelinePopup.querySelector(
          '.js-desc-shared-coin'
        );
        const followBlock = this.shareCoinToTimelinePopup.querySelector(
          '.js-follow-shared-coin'
        );

        // temporarily before fix on back for returning empty default cover src
        if (coverSrc.indexOf('d-cover') !== -1) {
          coverBlock.setAttribute('src', '#');
        } else {
          coverBlock.setAttribute('src', coverSrc);
        }

        avatarBlock.setAttribute('src', avatarSrc);
        nameBlock.textContent = nameOfCoin;
        descBlock.textContent = descOfCoin;

        if (isFollowed) {
          followBlock.textContent = 'Following';
        } else {
          followBlock.textContent = 'Follow';
        }
      });
  }

  initPagesMultiselect() {
    function templateForListWithResults(data) {
      if (!data.id) {
        return $(`
        <span>${data.text}</span>
      `);
      }

      return $(`
        <div class="select2-item">
          <img src="${data.avatar}"
            class="select2-item__img"
            alt="Avatar of page"/>
          <span>${data.text}</span>
        </div>
    `);
    }

    function templateForSelectedResults(data) {
      return $(
        `<span class="js-page-name" data-pageid="${data.id}">${data.text}</span>`
      );
    }

    $('.js-chose-page-select').select2({
      placeholder: 'Chose pages',
      ajax: {
        delay: 250,
        url: `${this.locationOrigin}/v2/api/users/${this.userId}/pages/owner?page=1&amount=10`,
        dataType: 'json',
        data(params) {
          const query = {
            search: params.term,
            page: params.page || 1,
          };
          return query;
        },
        processResults: (data, params) => {
          const pageNumber = params.page || 1;

          const res = data.map((item) => ({
            id: item.page_id,
            text: item.page_title,
            avatar: item.avatar,
          }));

          return {
            results: res,
            pagination: {
              more: pageNumber * 10 < this.countOfUserPages,
            },
            page: pageNumber,
          };
        },
      },
      templateResult: templateForListWithResults,
      templateSelection: templateForSelectedResults,
    });
  }

  shareToPage() {
    if (!this.sharePopupSelectBlock.classList.contains('is-visible')) {
      this.sharePopupSelectBlock.classList.add('is-visible');
    }

    if (!this.pageSelect.classList.contains('is-visible')) {
      this.pageSelect.classList.add('is-visible');
    }

    this.publishSharedCoinBtn.setAttribute('disabled', 'true');

    this.initPagesMultiselect();

    this.publishSharedCoinBtn.classList.add('js-share-to-page');
    this.customPrivacySelectForTimeline.classList.add('hidden');
    this.customPrivacySelectForPages.classList.remove('hidden');
  }

  shareToTimeline() {
    if (this.sharePopupSelectBlock.classList.contains('is-visible')) {
      this.sharePopupSelectBlock.classList.remove('is-visible');
    }

    this.publishSharedCoinBtn.classList.remove('js-share-to-page');
    this.customPrivacySelectForPages.classList.add('hidden');
    this.customPrivacySelectForTimeline.classList.remove('hidden');
  }

  validateShareBtn() {
    const selectedItemsBlock = this.shareCoinToTimelinePopup.querySelector(
      '.select2-selection__rendered'
    );

    if (
      this.counter.textContent.indexOf('-') !== -1 ||
      (this.sharePopupSelectBlock.classList.contains('is-visible') &&
        selectedItemsBlock &&
        selectedItemsBlock.innerHTML === '')
    ) {
      this.publishSharedCoinBtn.setAttribute('disabled', 'true');
    } else {
      this.publishSharedCoinBtn.removeAttribute('disabled');
    }
  }

  publishSharedCoin() {
    let selectedPostPrivacy;
    let selectedPostPrivacyKey;

    if (this.publishSharedCoinBtn.classList.contains('js-share-to-page')) {
      selectedPostPrivacy = $(this.defaultPrivacySelectForPages).val();

      switch (selectedPostPrivacy) {
        case 'likedmypage':
          selectedPostPrivacyKey = 2;
          break;
        default:
          selectedPostPrivacyKey = 0;
      }
    } else {
      selectedPostPrivacy = $(this.defaultPrivacySelectForTimeline).val();

      switch (selectedPostPrivacy) {
        case 'everyone':
          selectedPostPrivacyKey = 0;
          break;
        case 'ifollow':
          selectedPostPrivacyKey = 1;
          break;
        case 'followme':
          selectedPostPrivacyKey = 2;
          break;
        default:
          selectedPostPrivacyKey = 3;
      }
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postText: this.textarea.value,
        postPrivacy: selectedPostPrivacyKey,
        disabled_comments: Number(
          !this.shareCoinToTimelinePopup.querySelector('#comments').checked
        ),
        disabled_notifications: Number(
          !this.shareCoinToTimelinePopup.querySelector('#notifications').checked
        ),
      }),
    };

    if (this.publishSharedCoinBtn.classList.contains('js-share-to-page')) {
      const selectedPages =
        this.shareCoinToTimelinePopup.querySelectorAll('.js-page-name');

      selectedPages.forEach((selectedPage) => {
        const targetPageId = selectedPage.getAttribute('data-pageid');

        fetch(
          `${this.locationOrigin}/v2/api/posts/share-page?page_id=${targetPageId}&shared_page_id=${this.pageIdForShare}&share=page`,
          requestOptions
          // eslint-disable-next-line no-console
        ).catch((response) => console.log(response));
      });
    } else {
      fetch(
        `${this.locationOrigin}/v2/api/posts/share-page-timeline?shared_page_id=${this.pageIdForShare}&share=timeline`,
        requestOptions
        // eslint-disable-next-line no-console
      ).catch((response) => console.log(response));
    }

    this.shareCoinSnackbar.addMessage(
      'success',
      'Coin page is successfully shared'
    );
  }

  listeners() {
    if (this.shareToSocialsBtn) {
      window.addEventListener('resize', () => {
        this.changeTextareaPlaceholder();
      });

      if (this.shareToSocialsBtn) {
        this.shareToSocialsBtn.addEventListener('click', () => {
          this.cancelShareCoinToSocials();
          this.shareCoinToSocials();
        });
      }

      if (this.radioShareToPage) {
        this.radioShareToPage.addEventListener('click', () => {
          this.shareToPage();
          this.validateShareBtn();
        });
      }

      if (this.radioShareToTimeline) {
        this.radioShareToTimeline.addEventListener('click', () => {
          this.shareToTimeline();
          this.validateShareBtn();
        });
      }

      this.publishSharedCoinBtn.addEventListener('click', () => {
        this.publishSharedCoin();
      });

      this.textarea.addEventListener('input', () => {
        this.changeTextareaHeight();
        this.validateShareBtn();
      });

      this.textarea.addEventListener('keyup', () => {
        this.changeTextareaHeight();
        this.validateShareBtn();
      });

      $('#page_title').on('select2:close', () => {
        this.validateShareBtn();
      });

      this.openShareToTimelinePopupBtn.addEventListener('click', () => {
        this.resetPopupData();
        this.setSharedPageInfo();
        this.changeTextareaPlaceholder();
        this.changeTextareaHeight();
      });
    }
  }

  init() {
    if (this.shareCoinToTimelinePopup) {
      this.listeners();
    }

    if (this.shareCoinToSocialsPopup) {
      this.shareCoinToSocialsPopup.setAttribute(
        'data-url',
        window.location.href
      );
    }

    if (this.copyLinkBtn) {
      this.copyLinkBtn.setAttribute('data-copy-link', window.location.href);
    }
  }
}

export default ShareCoin;
