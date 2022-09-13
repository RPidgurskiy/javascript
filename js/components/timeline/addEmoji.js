import CharLimitsCounter from '../char-limits';

class AddEmoji {
  constructor(emojiWrapper) {
    this.emojiWrapper = emojiWrapper;
    this.targetInput = emojiWrapper.querySelector('.js-emoji-target-input');
    this.emojiOpenBtn = emojiWrapper.querySelector('.js-emoji-open-btn');
    this.emojiDropdownBlock = emojiWrapper.querySelector(
      '.js-emoji-dropdown-block'
    );
    this.emojiList = emojiWrapper.querySelector('.js-emoji-list');
    this.emojiItems = Array.from(
      emojiWrapper.querySelectorAll('.js-emoji-item')
    );
  }

  addEmojiToDropdownBlock = () => {
    // ajax for adding emoji to this.emojiDropdownBlock;
  };

  insertEmojiToInput(item) {
    const emojiCode = item.textContent;
    const inputValue = this.targetInput.value;
    const currentFocusPosition = this.targetInput.selectionStart;
    const charLimitsCounter = new CharLimitsCounter(
      this.emojiWrapper.closest('.js-counter-wrapper')
    );

    if (this.targetInput.value.length === 0) {
      this.targetInput.value = emojiCode.trim();
    } else {
      this.targetInput.value =
        inputValue.slice(0, currentFocusPosition) +
        emojiCode.trim() +
        inputValue.slice(currentFocusPosition);
    }

    this.targetInput.style.height = `${this.targetInput.scrollHeight}px`;

    this.targetInput.focus();

    charLimitsCounter.initCounter();
  }

  listeners() {
    this.emojiOpenBtn.addEventListener('click', () => {
      this.addEmojiToDropdownBlock();
    });

    this.emojiItems.forEach((item) => {
      item.addEventListener('click', () => {
        this.insertEmojiToInput(item);
      });
    });
  }

  init() {
    if (this.targetInput) {
      this.listeners();
    }
  }
}

export default AddEmoji;
