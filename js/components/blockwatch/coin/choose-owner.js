import 'select2';

import axios from 'axios';
import $ from 'jquery';

import CustomModal from '../../custom-modal';
import Snackbar from '../../snackbar';

class ChooseOwner {
  constructor() {
    this.coinOwnersWrapper = document.querySelector('.js-coin-settings-form');
    this.snackbar = new Snackbar();
    this.coinOwnerModal = new CustomModal(
      'choose-owner-company',
      'js-open-modal-owner'
    );
    this.list = document.querySelector('.customSelectAvatars');
    this.coinOwners = document.querySelector('.js-coin-owners');
    this.submitBtn = document.querySelector('.js-submit-btn');
    this.inputCoinId = document.querySelector('.coin_id');
  }

  listeners() {
    this.userId = document.querySelector('.user_id').value;
    const location = window.location.origin;
    function template(data) {
      if (data.id) {
        return $(
          `<div class="select2-item">
             <img src="${data.avatar}"
             class="select2-item__img select2-item__img--sm"
             alt=""/>
             <span>${data.text}</span>
          </div>`
        );
      }
      return $(
        `<div class="select2-item">
            <span>${data.text}</span>
        </div>`
      );
    }
    function result(data) {
      if (!data.id) {
        return $(`
          <div class="select2-item">
            ${data.text}
         </div>`);
      }
      return $(`
          <div class="select2-item">
           <img src="${data.avatar}"
           class="select2-item__img"
           alt=""/>
           <span>${data.text}</span>
           </div>`);
    }
    if (this.coinOwners) {
      $('.customSelectAvatars').select2({
        results: [{ id: 1111 }],
        ajax: {
          url: `${location}/v2/api/users/${this.userId}/pages/owner`,
          dataType: 'json',
          data: () => ({}),
          processResults: (data) => {
            const res = data.map((item) => ({
              id: item.page_id,
              text: item.page_name,
              avatar: item.avatar,
            }));
            return {
              results: res,
            };
          },
        },
        width: '100%',
        placeholder: 'Choose owner company',
        templateSelection: template,
        templateResult: result,
        minimumResultsForSearch: 1,
      });
    }
    if (this.coinOwners) {
      this.coinOwners.addEventListener('submit', (e) => {
        e.preventDefault();
        const pageId = $('.customSelectAvatars').find(':selected').val();
        axios
          .put(
            `${location}/v2/api/coins/${this.inputCoinId.value}/owner-company?owner_page_id=${pageId}`
          )
          .then(() => {
            this.snackbar.addMessage(
              'success',
              'Settings successfully updated'
            );
            this.coinOwnerModal.close();
          })
          .catch((err) => {
            throw err;
          });
      });
    }
  }

  init() {
    if (this.coinOwnersWrapper) {
      this.listeners();
    }
  }
}

export default ChooseOwner;
