import axios from 'axios';
import $ from 'jquery';

import AvatarEdit from '../../avatarEdit';
import Cover from '../../cover';
import Snackbar from '../../snackbar';

class ProfileSettings {
  constructor() {
    this.locationOrigin = window.location.origin;
    this.coverImage = document.querySelector('.b-cover__img');
    this.avatarEdit = document.querySelector('.js-coin-settings-avatar');
    this.coverSrc = document.querySelector('.cover__image');
    this.repositionImg = document.querySelector('.b-cover__reposition img');
    this.profileDescription = document.querySelector('.profile-description');
    this.profileButton = document.querySelectorAll('.profile-save-btn');
    this.addLinkBtn = document.querySelector('.js-add-links');
    this.additionalLink = document.querySelector('.js-additional-link.hidden');
    this.formData = new FormData();
    this.updatedSettingsSnackbar = new Snackbar();
    this.coinPageCard = document.querySelector('.b-coin-setting__cover');
    if (document.querySelector('.coin_id')) {
      this.coinId = document.querySelector('.coin_id').value;
    }
    this.deleteAdLink = document.querySelectorAll('.js-delete-additional-link');
  }

  handleLinks() {
    this.profileAddedLink = document.querySelectorAll(
      '.js-socials-input:not(.is-hidden):not(.error)'
    );
    this.profileAddedLink.forEach((input, index) => {
      const parent = $(input).closest('.js-additional-link');
      let name;
      if (parent.length > 0) {
        name = $(parent).find('.customSelect').val();
      } else {
        name = input.getAttribute('name');
      }
      const link = input.value;
      if (link !== '') {
        this.formData.set(`links[${index}][category]`, `${name}`);
        this.formData.set(`links[${index}][url]`, `${link}`);
      }
    });
  }

  handleFormData() {
    this.formData = new FormData();
    const blankDataImageSrc =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    const avatarValue =
      this.avatarEdit.getAttribute('src') !== blankDataImageSrc
        ? this.avatarEdit.getAttribute('src')
        : '';
    const coverValue =
      this.coverImage.getAttribute('src') !== blankDataImageSrc
        ? this.coverImage.getAttribute('src')
        : '';
    this.formData.set('description', this.profileDescription.value);
    this.formData.set('avatar', avatarValue);
    this.formData.set('cover', coverValue);
    this.handleLinks();
  }

  setProfileSettingsData() {
    this.handleFormData();
    axios
      .put(
        `${this.locationOrigin}/v2/api/coins/${this.coinId}/settings/profile`,
        new URLSearchParams(this.formData)
      )
      .then((response) => {
        if (response.status === 204) {
          this.updatedSettingsSnackbar.addMessage(
            'success',
            'Settings successfully updated'
          );
        }
      });
  }

  listeners() {
    const validateCustomLinks = () => {
      const webSiteArr = [];
      const sourceArr = [];
      const whiteArr = [];
      const etherArr = [];
      const links = document.querySelectorAll('.customSelect');

      links.forEach((link) => {
        switch (link.value) {
          case 'Website':
            webSiteArr.push(link.value);
            break;
          case 'Source code':
            sourceArr.push(link.value);
            break;
          case 'Whitepapper':
            whiteArr.push(link.value);
            break;
          case 'Etherscan':
            etherArr.push(link.value);
            break;
          default:
            break;
        }
      });

      return (
        webSiteArr.length <= 3 &&
        sourceArr.length <= 3 &&
        whiteArr.length <= 3 &&
        etherArr.length <= 3
      );
    };

    this.profileButton.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateCustomLinks()) {
          this.setProfileSettingsData();
        } else {
          this.updatedSettingsSnackbar.addMessage(
            'danger',
            'Not more 3 links in same category '
          );
        }
      });
    });

    if (this.deleteAdLink.length > 0) {
      this.deleteAdLink.forEach((item) => {
        item.addEventListener('click', () => {
          item.closest('.b-coin-setting__additional-box').remove();
          this.handleFormData();
        });
      });
    }
  }

  setNewCoverSettings(img) {
    this.formData.set('cover', img);
    this.setProfileSettingsData();
  }

  setNewAvatarSettings(img) {
    this.formData.set('avatar', img);
    this.setProfileSettingsData();
  }

  init() {
    if (this.coinPageCard) {
      this.listeners();
      this.handleFormData();
      const cover = new Cover(
        this.coinPageCard,
        this.setNewCoverSettings.bind(this)
      );
      cover.init();
    }
    if (this.avatarEdit) {
      const avatarEdit = new AvatarEdit(
        'js-coin-settings-avatar',
        this.setNewAvatarSettings.bind(this)
      );
      avatarEdit.init();
    }
  }
}

export default ProfileSettings;
