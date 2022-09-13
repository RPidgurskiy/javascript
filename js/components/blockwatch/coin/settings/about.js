import 'select2';

import $ from 'jquery';

import FormValidation from '../../../../services/validation';
import VideoPlayer from '../../../../services/videoPlayer';
import AddVideo from '../../../addVideo';
import Snackbar from '../../../snackbar';

class AboutSettings {
  constructor() {
    if (document.querySelector('.js-coin-id')) {
      this.coinId = document.querySelector('.js-coin-id').value;
    }
    this.locationOrigin = window.location.origin;
    this.locationHref = window.location.href;
    this.saveAboutSettingsBtns = document.querySelectorAll(
      '.js-save-about-settings-btn'
    );
    this.coinDescTextarea = document.querySelector('.js-coin-about-desc');
    this.additionalLink = document.querySelector('.js-additional-link.hidden');
    this.coinTag = document.querySelector('.js-coin-tag.hidden');
    this.addLinkBtn = document.querySelector('.js-add-links');
    this.hiddenBlocks = document.querySelectorAll('.js-hidden-block');
    this.tagsBlock = document.querySelector('.js-coin-tags-block');
    this.tagsSelect = document.querySelector('.js-coin-tags-select');
    this.initAddTagsPopupBtn = document.querySelector('.js-add-tag');
    this.saveAddedTagsBtn = document.querySelector('.js-submit-add-tags');
    this.socialsLinksArray = [];
    this.tagsArray = [];
    this.videoLink = null;
    this.videoCoverLink = null;
    this.updatedSettingsSnackbar = new Snackbar();
    this.addVideoBtn = document.querySelector('.js-choose-video');
    this.addedVideoBlock = document.querySelector('.js-added-video-block');
    if (this.addedVideoBlock) {
      this.addedVideoBlockItem = this.addedVideoBlock.querySelector(
        '.js-added-video-block-item'
      );
    }
    this.addedVideoHiddenInput = document.querySelector(
      '.js-youtube-video-hidden-input'
    );
    this.emptyVideoState = document.querySelector('.js-empty-video-state');
    this.videoPlayer = null;
  }

  insertAboutSettingsData() {
    fetch(`${this.locationOrigin}/v2/api/coins/${this.coinId}/settings/about`)
      .then((response) => response.json())
      .then((data) => {
        const coinDesc = data.about;
        const socialsLinks = data.socials;
        const tagsList = data.tags;
        const videoLink = data.video;
        const videoCoverLink = data.video_cover;

        this.insertVideo(videoLink, videoCoverLink);
        this.videoLink = videoLink;
        this.videoCoverLink = videoCoverLink;

        if (coinDesc !== null) {
          this.coinDescTextarea.value = coinDesc;
        } else {
          this.coinDescTextarea.value = '';
        }

        socialsLinks.forEach((linkItem) => {
          const socialName = linkItem[0].toLowerCase();
          const socialLink = linkItem[1];
          const staticLink = document.querySelector(`[name = '${socialName}']`);

          if (staticLink) {
            staticLink.value = socialLink;
          } else if (socialLink !== null) {
            const aditionalLink = this.additionalLink.cloneNode(true);
            const linkInput = aditionalLink.querySelector('input');

            document
              .querySelector('.js-additional-links')
              .insertBefore(aditionalLink, this.addLinkBtn);
            linkInput.setAttribute('name', socialName);
            linkInput.value = socialLink;
            aditionalLink.classList.remove('hidden');
            aditionalLink.querySelector('input').classList.remove('is-hidden');

            const initFormValidation = () => {
              const validationGroup = document.querySelector('form');
              const validation = () => new FormValidation(validationGroup);
              validation();
            };
            initFormValidation();
          }
        });

        tagsList.forEach((tag) => {
          this.addTag(tag);
        });

        this.hiddenBlocks.forEach((block) => {
          block.classList.remove('hidden');
        });

        const tagRemoveBtns = document.querySelectorAll('.js-tag-close');
        const tagNames = document.querySelectorAll(
          '.js-coin-tag-name:not(.is-hidden)'
        );
        this.initRemoveTags(tagRemoveBtns);
        this.setTagsBlockStyle(tagNames);
      })
      .catch(() => {
        this.hiddenBlocks.forEach((block) => {
          block.classList.remove('hidden');
        });
        this.emptyVideoState.classList.remove('hidden');
      });
  }

  updateAboutSettingsData() {
    const socialLinksInputs = document.querySelectorAll(
      '.js-socials-input:not(.is-hidden):not(.error)'
    );

    const tagsItems = document.querySelectorAll(
      '.js-coin-tag-name:not(.is-hidden)'
    );

    socialLinksInputs.forEach((input) => {
      const name = input.getAttribute('name');
      const link = input.value;
      const socialLinkData = [`${name}`, `${link}`];

      if (link !== '') {
        this.socialsLinksArray.push(socialLinkData);
      }
    });

    tagsItems.forEach((tag) => {
      const tagName = tag.innerHTML.trim().slice(1);
      this.tagsArray.push(tagName);
    });

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video: this.videoLink,
        video_cover: this.videoCoverLink,
        socials: this.socialsLinksArray,
        tags: this.tagsArray,
      }),
    };

    fetch(
      `${this.locationOrigin}/v2/api/coins/${this.coinId}/settings/about`,
      requestOptions
    )
      .then(() => {
        this.socialsLinksArray = [];
        this.updateHashtagsDatabase();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  updateHashtagsDatabase() {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        defaultHashtags: this.tagsArray,
      }),
    };

    fetch(`${this.locationOrigin}/v2/api/hashtags/default`, requestOptions)
      .then(() => {
        this.updatedSettingsSnackbar.addMessage(
          'success',
          'Settings successfully updated'
        );
        this.tagsArray = [];
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.debug(error);
      });
  }

  insertVideo(videoLink, videoCoverLink) {
    const addedVideoBlockItemCloned = this.addedVideoBlockItem.cloneNode(true);
    const addedVideoByLinkBlock = addedVideoBlockItemCloned.querySelector(
      '.js-added-video-by-link'
    );
    const addedVideoByLoadBlock = addedVideoBlockItemCloned.querySelector(
      '.js-added-video-by-load'
    );

    const insertYoutubeVideo = (hashOfYoutubeVideo) => {
      addedVideoByLinkBlock.setAttribute(
        'data-plyr-embed-id',
        hashOfYoutubeVideo
      );

      addedVideoByLinkBlock.id = 'addedVideo';

      if (videoCoverLink !== null) {
        addedVideoByLinkBlock.setAttribute('data-poster', videoCoverLink);
      }

      this.videoPlayer = new VideoPlayer(addedVideoByLinkBlock);
      this.videoPlayer.init();

      addedVideoByLoadBlock.classList.add('hidden');
      addedVideoByLinkBlock.classList.remove('hidden');
    };

    if (videoLink !== null) {
      this.addedVideoBlock.appendChild(addedVideoBlockItemCloned);
      let hashOfYoutubeVideo;

      if (videoLink.indexOf('https://youtu.be') !== -1) {
        const index = videoLink.lastIndexOf('/');
        hashOfYoutubeVideo = videoLink.slice(index + 1);
        insertYoutubeVideo(hashOfYoutubeVideo);
      } else if (videoLink.indexOf('https://www.youtube.com') !== -1) {
        const index1 = videoLink.indexOf('&list');

        if (index1 !== -1) {
          const trimmedLinkMediate = videoLink.slice(0, index1);
          const index2 = trimmedLinkMediate.indexOf('v=');
          hashOfYoutubeVideo = trimmedLinkMediate.slice(index2 + 2);
        } else {
          const index2 = videoLink.indexOf('v=');
          hashOfYoutubeVideo = videoLink.slice(index2 + 2);
        }

        insertYoutubeVideo(hashOfYoutubeVideo);
      } else {
        addedVideoByLoadBlock
          .querySelector('source')
          .setAttribute('src', videoLink);

        addedVideoByLoadBlock.id = 'addedVideo';

        if (videoCoverLink !== null) {
          addedVideoByLoadBlock.setAttribute('data-poster', videoCoverLink);
        }

        this.videoPlayer = new VideoPlayer(addedVideoByLoadBlock);
        this.videoPlayer.init();

        addedVideoByLoadBlock.classList.remove('hidden');
        addedVideoByLinkBlock.classList.add('hidden');
      }

      this.addedVideoBlock.classList.remove('hidden');
      addedVideoBlockItemCloned.classList.remove('hidden');
      addedVideoBlockItemCloned.classList.add('is-cloned');
      this.emptyVideoState.classList.add('hidden');
    } else {
      this.emptyVideoState.classList.remove('hidden');
      this.addedVideoBlock.classList.add('hidden');
    }
  }

  removeVideo() {
    this.videoLink = null;
    this.videoCoverLink = null;
    this.addedVideoBlock
      .querySelector('.js-added-video-block-item.is-cloned')
      .remove();
    this.addedVideoBlock.classList.add('hidden');
    this.emptyVideoState.classList.remove('hidden');
    this.updateAboutSettingsData();
  }

  updatePageAfterVideoAdding(videoLink, coverLink) {
    this.videoLink = videoLink;
    this.videoCoverLink = coverLink;
    this.insertVideo(videoLink, coverLink);
    this.updateAboutSettingsData();
  }

  addTag(tag) {
    const newTag = this.coinTag.cloneNode(true);
    const tagNameBlock = newTag.querySelector('.js-coin-tag-name');

    tagNameBlock.textContent = `#${tag}`;
    this.tagsBlock.appendChild(newTag);
    newTag.classList.remove('hidden');
    tagNameBlock.classList.remove('is-hidden');
  }

  initRemoveTags = (tagRemoveBtns) => {
    if (tagRemoveBtns.length > 0) {
      tagRemoveBtns.forEach((item) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          item.closest('.b-coin-tags__item').remove();
          const tags = document.querySelectorAll(
            '.js-coin-tag-name:not(.is-hidden)'
          );
          this.setTagsBlockStyle(tags);
        });
      });
    }
  };

  setTagsBlockStyle = (tags) => {
    const tagsBottomBlock = document.querySelector('.js-coin-tags-bottom');

    if (tags.length > 0) {
      this.tagsBlock.classList.remove('hidden');
      tagsBottomBlock.classList.remove('hidden');
    } else {
      this.tagsBlock.classList.add('hidden');
      tagsBottomBlock.classList.add('hidden');
    }
  };

  initDefaultTagsMultiselect = () => {
    const ajaxUrl = `${this.locationOrigin}/v2/api/hashtags/default?page=1&amount=10`;

    $(this.tagsSelect).val(null).trigger('change');

    $(this.tagsSelect).select2({
      tags: true,
      placeholder: 'Add tags',
      dropdownPosition: 'below',
      // eslint-disable-next-line consistent-return
      createTag(params) {
        const term = $.trim(params.term);

        if (term === '') {
          return null;
        }

        return {
          id: `#${term}`,
          text: `#${term}`,
          newTag: true,
        };
      },
      multiple: true,
      ajax: {
        url: ajaxUrl,
        dataType: 'json',
        delay: 250,
        data(params) {
          return {
            q: params.term,
            page: params.page,
          };
        },
        // eslint-disable-next-line consistent-return
        processResults(data, params) {
          // eslint-disable-next-line no-param-reassign
          params.page = params.page || 1;

          if (data.results.length !== 0) {
            return {
              results: data.results,
              pagination: {
                more: data.pagination.more,
              },
            };
          }

          if (data.results.length === 0) {
            $(this.tagsSelect).val(null).trigger('change');
          }
        },
      },
    });

    document
      .querySelector('.select2-search__field')
      .setAttribute('maxlength', 32);
  };

  insertAddedTags() {
    const addedTags = document.querySelectorAll(
      '.select2-selection__choice__display'
    );

    addedTags.forEach((tag) => {
      const tagName = tag.textContent.slice(1);
      this.addTag(tagName);
    });

    const tagRemoveBtns = document.querySelectorAll('.js-tag-close');
    const tagNames = document.querySelectorAll(
      '.js-coin-tag-name:not(.is-hidden)'
    );
    this.initRemoveTags(tagRemoveBtns);
    this.setTagsBlockStyle(tagNames);
  }

  listeners() {
    if (this.addVideoBtn) {
      const self = this;
      const addVideo = new AddVideo(
        this.addVideoBtn,
        `${this.locationOrigin}/v2/api/files/upload`,
        self.updatePageAfterVideoAdding.bind(this)
      );
      addVideo.init();
    }

    this.saveAboutSettingsBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.updateAboutSettingsData();
      });
    });

    this.initAddTagsPopupBtn.addEventListener('click', () => {
      this.initDefaultTagsMultiselect();
    });

    this.saveAddedTagsBtn.addEventListener('click', () => {
      this.insertAddedTags();

      this.saveAddedTagsBtn
        .closest('.js-custom-modal')
        .classList.remove('open');
    });

    this.addedVideoBlock.addEventListener('click', (e) => {
      if (
        e.target.classList.contains('js-remove-video-btn') ||
        e.target.closest('.js-remove-video-btn')
      ) {
        this.removeVideo();
      }
    });
  }

  init() {
    this.insertAboutSettingsData();
    this.listeners();
  }
}

export default AboutSettings;
