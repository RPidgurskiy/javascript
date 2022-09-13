import AvatarEdit from '../../avatarEdit';
import Cover from '../../cover';

class CoinTopSection {
  constructor() {
    this.coinPage = document.querySelector('.b-coin-page');

    if (this.coinPage) {
      this.coinPageCard = this.coinPage.querySelector('.js-coin-page-card');
      this.avatarEdit = document.querySelector('.js-coin-avatar');
    }

    if (document.querySelector('.js-coin-id')) {
      this.coinId = document.querySelector('.js-coin-id').value;
    }

    this.locationOrigin = window.location.origin;
  }

  setNewCoverSettings(imgSrc) {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cover_full: imgSrc,
        cover: imgSrc,
      }),
    };

    fetch(
      `${this.locationOrigin}/v2/api/coins/${this.coinId}/settings/profile`,
      requestOptions
    ).then(() => {
      document.querySelector('.b-cover').querySelector('.js-cover-preloader').remove();
    });
  }

  setNewAvatarSettings() {
    const avatarImageSrc = document
      .querySelector('.js-coin-avatar')
      .getAttribute('src');

    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        avatar_full: avatarImageSrc,
        avatar: avatarImageSrc
      }),
    };

    fetch(
      `${this.locationOrigin}/v2/api/coins/${this.coinId}/settings/profile`,
      requestOptions
    ).then(() => {
    });
  }

  init() {
    if (this.coinPage) {
      const cover = new Cover(
        this.coinPageCard,
        this.setNewCoverSettings.bind(this)
      );
      const avatarEdit = new AvatarEdit(
        'js-coin-avatar',
        this.setNewAvatarSettings.bind(this)
      );

      cover.init();
      avatarEdit.init();
    }
  }
}
export default CoinTopSection;
