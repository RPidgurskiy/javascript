class CharLimitsCounter {
  constructor(counterWrapper) {
    this.counterWrapper = counterWrapper;
    this.bioCounter = counterWrapper.querySelector('.js-characters-limit');
    this.counterBlock = counterWrapper.querySelector('.js-form-characters');
    this.textareaLimit = counterWrapper.querySelector('.js-textarea-limit');
    this.textareaBtn = counterWrapper.querySelector('.js-textarea-btn');
  }

  initCounter() {
    this.dataLimit = this.bioCounter.dataset.limit;
    this.textLength = this.textareaLimit.value.length;
    if (this.textareaBtn) {
      this.textareaBtn.disabled = true;
    }
    this.textLength = this.textareaLimit.value.length;
    this.bioCounter.textContent = this.dataLimit - this.textLength;

    if (this.textLength > this.dataLimit) {
      this.counterBlock.classList.add('is-error');
      if (this.textareaBtn) {
        this.textareaBtn.disabled = true;
      }
    } else if (this.textLength === 0) {
      if (this.textareaBtn) {
        this.textareaBtn.disabled = true;
      }
      this.counterBlock.classList.remove('is-error');
    } else if (
      this.textLength === 0 &&
      this.textareaLimit.classList.contains('js-post-textarea')
    ) {
      if (this.textareaBtn) {
        this.textareaBtn.disabled = false;
      }
      this.counterBlock.classList.remove('is-error');
    } else if (
      this.textLength === 0 &&
      this.textareaLimit.classList.contains('js-comment-textarea')
    ) {
      if (this.textareaBtn) {
        this.textareaBtn.disabled = false;
      }
      this.counterBlock.classList.remove('is-error');
    } else {
      this.counterBlock.classList.remove('is-error');
      if (this.textareaBtn) {
        this.textareaBtn.disabled = false;
      }
    }
  }

  listeners() {
    if (this.counterWrapper.closest('.js-post-edit-block') !== null) {
      this.initCounter();
    }

    this.textareaLimit.addEventListener('input', () => {
      this.initCounter();
    });

    this.textareaLimit.addEventListener('keydown', () => {
      this.initCounter();
    });
  }

  init() {
    this.listeners();
  }
}
export default CharLimitsCounter;
