import axios from 'axios';

import Snackbar from '../../snackbar';

class CreateCoin {
  constructor() {
    this.coinForm = document.querySelector('.js-create-coin-form');
    this.snackbar = new Snackbar();
  }

  listeners() {
    const location = window.location.origin;
    if (this.coinForm) {
      this.coinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pageName = document.querySelector('[name="pageName"]').value;
        const coinUrl = document.querySelector('[name="coinUrl"]').value;
        const coinName = document.querySelector('[name="coinName"]').value;
        const coinTicker = document.querySelector('[name="coinTicker"]').value;
        const coinDesc = document.querySelector('[name="coinDesc"]').value;
        this.submitBtn = document.querySelector('.js-submit-btn');
        axios
          .post(`${location}/v2/api/coins`, {
            name: pageName,
            coin_name: coinName,
            ticker: coinTicker,
            url: coinUrl,
            desc: coinDesc,
          })
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              // eslint-disable-next-line no-console
              console.log('success', response);
              this.submitBtn.setAttribute('disabled', 'true');
              this.snackbar.addMessage(
                'success',
                `${pageName} was created`
              );
              setTimeout(() => {
                window.location.href = `${location}/v2/blockwatch/${coinTicker}`;
              }, 1000);
            }
          })
          .catch((err) => {
            this.snackbar.addMessage(
              'danger',
              `${coinName} is already existed in Blockwatch`
            );
            throw err;
          });
      });
      const searchCoinBtns = document.querySelectorAll('.js-find-coin');
      searchCoinBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const coinName = document.querySelector('#coinName').value;
          const coinTicker = document.querySelector('[name="coinTicker"]');
          this.submitBtn = document.querySelector('.js-submit-btn');
          const event = new Event('change');
          axios
            .get(`${location}/v2/api/tickers/coin_gecko/${coinName}`)
            .then((response) => {
              if (response.status === 200 || response.status === 201) {
                const { ticker } = response.data;
                coinTicker.value = ticker;
                coinTicker.dispatchEvent(event);
                // eslint-disable-next-line no-console
                console.log('success', response);
              }
            })
            .catch((err) => {
              this.snackbar.addMessage('danger', `${coinName} not found`);
              throw err;
            });
        });
      });
    }
  }

  init() {
    this.listeners();
  }
}

export default CreateCoin;
