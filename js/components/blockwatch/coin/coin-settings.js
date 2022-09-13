import axios from 'axios';

import Snackbar from '../../snackbar';

class CoinSettings {
  constructor() {
    this.location = window.location.origin;
    this.coinForm = document.querySelector('.js-coin-settings-form');
    this.snackbar = new Snackbar();
    this.inputCoinId = document.querySelector('.coin_id');
    this.switcher = document.querySelector('.js-user-can-post-switcher');
    this.submitBtn = document.querySelector('.js-cs-form-btn');
    this.inputUrl = document.querySelector('.pageUrl');
    this.deleteCoinBtn = document.querySelector('.js-submit-delete-page');
    this.googleDeleteCoinBtn = document.querySelector('.js-google-delete-page');
    this.coinPageId = document.querySelector('.js-coin-page-id');
    this.googleClientIdInput = document.querySelector('.js-google-app-id');
    if(this.googleClientIdInput) {
      this.googleClientIdInputVal = this.googleClientIdInput.value;
    }
  }

  listeners() {
    if (this.switcher) {
      this.switcher.addEventListener('click', () => {
        if (!this.inputUrl.classList.contains('error')) {
          this.submitBtn.removeAttribute('disabled');
        }
      });
    }

    if (this.coinForm) {
      this.coinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputName = document.querySelector('.pageName').value;
        const inputUrl = document.querySelector('.pageUrl').value;
        this.submitBtn = document.querySelector('.js-submit-btn');
        const postSwitcher = document.querySelector(
          '.js-user-can-post-switcher'
        ).checked;
        axios
          .put(
            `${this.location}/v2/api/coins/${this.coinPageId.value}/settings/general`,
            {
              name: `${inputName}`,
              url: `${inputUrl}`,
              post_privacy: postSwitcher,
            }
          )
          .then(() => {
            this.submitBtn.setAttribute('disabled', 'true');
            this.snackbar.addMessage(
              'success',
              'Settings successfully updated'
            );
          });
      });

      const inputName = document.querySelector('.pageName');
      const inputUrl = document.querySelector('.pageUrl');
      const postSwitcher = document.querySelector('.js-user-can-post-switcher');
      axios
        .get(
          `${this.location}/v2/api/coins/${this.coinPageId.value}/settings/general`
        )
        .then((response) => {
          // eslint-disable-next-line camelcase
          const { name, url, post_privacy } = response.data;
          inputName.value = name;
          inputUrl.value = url;
          // eslint-disable-next-line camelcase
          if (post_privacy === true) {
            postSwitcher.setAttribute('checked', 'true');
          } else {
            postSwitcher.removeAttribute('checked');
          }
      })
        .catch(() => {
      });
    }

    if (this.deleteCoinBtn) {
      this.deleteCoinBtn.addEventListener('click', (e) => {
        const coinPassword = document.querySelector('.js-coin-password').value;
        e.preventDefault();

        axios
          .delete(`${this.location}/v2/api/coins/${this.inputCoinId.value}`, {
            data: {
              password: coinPassword,
            },
          })
          .then((response) => {
            if(response.status === 204 || response.status === 202) {
              this.snackbar.addMessage('success', 'deleted');

              setTimeout(() => {
                window.location.href = `${this.location}/v2/blockwatch`;
              }, 1000);
            }
          })
          .catch(() => {
            this.snackbar.addMessage('danger', 'Current password not match');
          });
      });
    }

    if (this.googleDeleteCoinBtn) {
      const self = this;

      const googleUser = {};

      const googleAuthentication = () => {
        // eslint-disable-next-line no-undef
        gapi.load('auth2', function () {
          // eslint-disable-next-line no-undef
          const auth2 = gapi.auth2.init({
            client_id: self.googleClientIdInputVal,
            scope: 'profile email'
          });

          auth2.attachClickHandler(self.googleDeleteCoinBtn, {},
            function (googleUser) {
              onSignIn(googleUser);
            }
          );
        });
      };

      const onSignIn = (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;

        axios({
          method: 'post',
          url: `${self.location}/v2/api/auth/google/verify`,
          data: {
            id_token: id_token,
          }
        })
        .then((response) => {
          if(response.status === 204) {
            axios
              .delete(`${self.location}/v2/api/coins/${this.inputCoinId.value}`, {
                data: {
                  google_confirmed: 1
                },
              })
              .then((response) => {
                if(response.status === 204 || response.status === 202) {
                  this.snackbar.addMessage('success', 'deleted');

                  setTimeout(() => {
                    window.location.href = `${this.location}/v2/blockwatch`;
                  }, 1000);
                }
              });
          }
        });
      };

      googleAuthentication();
    }
  }

  init() {
    this.listeners();
  }
}

export default CoinSettings;
