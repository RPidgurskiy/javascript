// import { debounce } from 'debounce';

class AddMention {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.textarea = wrapper.querySelector('textarea');
    this.mentionDropdown = wrapper.querySelector('.js-mention-dropdown');
    this.content = this.mentionDropdown.innerHTML;
    this.mentionText = '';
  }

  ajaxForMention() {
    // ajax for adding users into mention dropdown

    this.mentionDropdown.innerHTML = this.content; // temporary

    this.mentionDropdown.classList.add('is-visible');

    document.addEventListener('click', () => {
      this.mentionDropdown.classList.remove('is-visible');
    });
  }

  initAjaxForMention() {
    const text = this.textarea.value;
    const indexOfFocus = this.textarea.selectionStart;

    const regexp = /[@]/g;
    const mentions = [...text.matchAll(regexp)];
    let indexOfMention;
    let lengthOfMention;

    if (mentions.length !== 0) {
      mentions.forEach((item) => {
        const itemIndex = item.index;

        if (itemIndex < indexOfFocus) {
          const length = indexOfFocus - itemIndex;

          if (!lengthOfMention || length < lengthOfMention) {
            lengthOfMention = length;
            indexOfMention = itemIndex;
          }
        }
      });

      this.mentionText = text.slice(indexOfMention, indexOfFocus);

      if (this.mentionText.length > 1 && this.mentionText.indexOf(' ') === -1) {
        // debounce(() => {
        this.ajaxForMention();
        // }, 250);
      } else {
        this.mentionDropdown.classList.remove('is-visible');
      }
    }
  }

  insertMention(e) {
    const selectedMention = e.currentTarget.querySelector(
      '.js-mention-username'
    ).innerHTML;
    const currentFocusPosition = this.textarea.selectionStart;

    const newText = this.textarea.value.replace(this.mentionText, '');
    this.textarea.value = newText;

    this.textarea.value = `${
      this.textarea.value.slice(0, currentFocusPosition) +
      selectedMention.trim()
    } ${this.textarea.value.slice(currentFocusPosition)}`;

    this.textarea.focus();
  }

  initInsertMention() {
    const usersArray = Array.from(
      this.mentionDropdown.querySelectorAll('.js-mention-item')
    );

    usersArray.forEach((item) => {
      item.addEventListener('click', (event) => {
        this.insertMention(event);
      });
    });
  }

  listeners() {
    this.textarea.addEventListener('keyup', (e) => {
      this.initAjaxForMention();
      this.initInsertMention();

      if (e.keyCode === 32) {
        this.mentionText = '';
      }
    });
  }

  init() {
    this.listeners();
  }
}

export default AddMention;
