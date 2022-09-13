import $ from 'jquery';

import FormValidation from '../../../services/validation';

const customLinks = () => {
  const addLink = document.querySelector('.js-add-links');
  const additionalLinks = document.querySelectorAll('.js-additional-link');
  let i = additionalLinks.length > 0 ? additionalLinks.length : 0;

  const markupTemplate = (id, type = 'default') => {
    let templateAbout = '';
    if (type === 'about') {
      templateAbout = `
            <div class="b-coin-setting__additional-box b-coin-setting__additional-box--about">
                <div class="b-coin-setting__additional-group b-coin-setting__additional-group--about">
                    <label class="form__label" for="additional_link_${id}">Your link</label>
                    <input type="text" id="add_link_${id}" class="b-input js-socials-input" placeholder="Enter your link" name="additional_link_${id}">
                </div>
                <div class="b-coin-setting__additional-category">
                    <button type="button" class="b-coin-setting__additional-btn b-btn b-btn--secondary js-delete-link">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.49984 0.833496H11.4998C12.4203 0.833496 13.1665 1.57969 13.1665 2.50016V3.3335H15.6665C16.587 3.3335 17.3332 4.07969 17.3332 5.00016V6.66683C17.3332 7.5873 16.587 8.3335 15.6665 8.3335H15.5997L14.8332 17.5002C14.8332 18.4206 14.087 19.1668 13.1665 19.1668H4.83317C3.91269 19.1668 3.1665 18.4206 3.16938 17.5694L2.39973 8.3335H2.33317C1.4127 8.3335 0.666504 7.5873 0.666504 6.66683V5.00016C0.666504 4.07969 1.4127 3.3335 2.33317 3.3335H4.83317V2.50016C4.83317 1.57969 5.57936 0.833496 6.49984 0.833496ZM2.33317 5.00016H4.83317H13.1665H15.6665V6.66683H2.33317V5.00016ZM4.07191 8.3335H13.9275L13.1694 17.431L13.1665 17.5002H4.83317L4.07191 8.3335ZM11.4998 2.50016V3.3335H6.49984V2.50016H11.4998Z"/>
                        </svg>
                    </button>
                </div>
            </div>`;
    } else if (type === 'default') {
      templateAbout = `
            <div class="b-coin-setting__additional-box">
                <div class="b-coin-setting__additional-group">
                    <label for="custom_link_${id}"
                           class="form__label">Your Link</label>
                    <input type="text"
                           class="b-input js-socials-input"
                           placeholder="Enter URL link"
                           name="custom_link_${id}"
                           id="custom_link_${id}"
                           value="">
                </div>
            </div>
             <div class="b-coin-setting__additional-box">
                <div class="b-coin-setting__additional-category">
                <label class="form__label">Link Category</label>
                <select name="custom_link${id}" id="${id}" class="customSelect b-form__select">
                    <option value="Website">Website</option>
                    <option value="Whitepapper">Whitepapper</option>
                    <option value="Source code">Source code</option>
                    <option value="Etherscan">Etherscan</option>
                </select>
            </div>
            <div class="b-coin-setting__additional-category">
                <span class="b-coin-setting__additional-btn b-btn b-btn--secondary js-delete-link">
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.49984 0.833496H11.4998C12.4203 0.833496 13.1665 1.57969 13.1665 2.50016V3.3335H15.6665C16.587 3.3335 17.3332 4.07969 17.3332 5.00016V6.66683C17.3332 7.5873 16.587 8.3335 15.6665 8.3335H15.5997L14.8332 17.5002C14.8332 18.4206 14.087 19.1668 13.1665 19.1668H4.83317C3.91269 19.1668 3.1665 18.4206 3.16938 17.5694L2.39973 8.3335H2.33317C1.4127 8.3335 0.666504 7.5873 0.666504 6.66683V5.00016C0.666504 4.07969 1.4127 3.3335 2.33317 3.3335H4.83317V2.50016C4.83317 1.57969 5.57936 0.833496 6.49984 0.833496ZM2.33317 5.00016H4.83317H13.1665H15.6665V6.66683H2.33317V5.00016ZM4.07191 8.3335H13.9275L13.1694 17.431L13.1665 17.5002H4.83317L4.07191 8.3335ZM11.4998 2.50016V3.3335H6.49984V2.50016H11.4998Z"/>
                    </svg>
                </span>
            </div>
        </div>`;
    }
    return templateAbout;
  };

  if (addLink) {
    addLink.addEventListener('click', (e) => {
      e.preventDefault();
      const { type } = addLink.dataset;
      const addedLinks = document.querySelectorAll(
        '.js-additional-link:not(.hidden)'
      );

      if (addedLinks.length === 0 && type === 'default') {
        const title = document.createElement('div');
        title.classList.add('b-card__title');
        title.classList.add('js-title-links-block');
        title.innerHTML = 'Additional links';
        const beforeEl = document.querySelector('.js-default-links');
        beforeEl.after(title);
      }

      if (addedLinks && addedLinks.length > 0) {
        const nameOfLastLink = addedLinks[addedLinks.length - 1]
          .querySelector('.js-socials-input')
          .getAttribute('name');
        const index = nameOfLastLink.lastIndexOf('_');
        const numberOfLastLink = Number(nameOfLastLink.substring(index + 1));
        i = numberOfLastLink + 1;
      } else {
        i += 1;
      }
      const parent = addLink.closest('.js-additional-links');
      const el = document.createElement('div');
      el.innerHTML = markupTemplate(i, type);
      el.classList.add('js-additional-link');
      if (type === 'default') {
        el.classList.add('b-coin-setting__new-link');
      }
      parent.insertBefore(el, addLink);
      $('.customSelect').select2({
        width: '100%',
      });

      const initFormValidation = () => {
        const validationGroup = document.querySelector('.js-validation-group');
        const validation = () => new FormValidation(validationGroup);
        validation();
      };
      initFormValidation();
    });

    document.addEventListener('click', (e) => {
      const title = document.querySelector('.js-title-links-block');
      const addedLinks = document.querySelectorAll('.js-additional-link');
      const { type } = addLink.dataset;

      if (e.target.closest('.js-delete-link')) {
        e.target.closest('.js-additional-link').remove();
        if (title && addedLinks.length === 1 && type === 'default') {
          title.remove();
        }
      }
    });
  }
};

export default customLinks;
