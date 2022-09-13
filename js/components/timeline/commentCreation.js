import CharLimitsCounter from '../char-limits';
import Snackbar from '../snackbar';

class CommentCreation {
  constructor(writeCommentBlock) {
    this.writeCommentBlock = writeCommentBlock;
    this.commentTextarea = writeCommentBlock.querySelector(
      '.js-comment-textarea'
    );
    this.charactersLimit = writeCommentBlock.querySelector(
      '.js-characters-limit'
    );
    this.sendCommentBtn = writeCommentBlock.querySelector('.js-textarea-btn');
    this.commentButtonsBlock = writeCommentBlock.querySelector(
      '.js-write-comment-buttons'
    );
    this.addImageInput = writeCommentBlock.querySelector(
      '.js-comment-add-image'
    );
    this.deleteImageBtn = writeCommentBlock.querySelector(
      '.js-delete-photo-btn'
    );
    this.imageWrapper = writeCommentBlock.querySelector(
      '.js-comment-image-wrapper'
    );

    this.sorterOfComments = writeCommentBlock
      .closest('.js-comments-block')
      .querySelector('.js-comments-sorter');
    this.commentsStat = writeCommentBlock
      .closest('.js-post')
      .querySelector('.js-comments-stat');
    this.commentsCountBlock = writeCommentBlock
      .closest('.js-post')
      .querySelector('.js-comments-amount');
    this.errorMediaSnackbar = new Snackbar();
    this.validationMediaError = null;
  }

  changeCommentTextareaStyle() {
    this.commentTextarea.style.height = `${this.commentTextarea.scrollHeight}px`;

    if (this.commentTextarea.value.length >= 1) {
      this.commentTextarea.classList.add('is-active');
    } else {
      this.commentTextarea.classList.remove('is-active');
      this.commentTextarea.style.height = '36px';
    }
  }

  changeTextareaPlaceholder() {
    if (this.commentTextarea.offsetWidth < 280) {
      this.commentTextarea.setAttribute('placeholder', 'Comment...');
    } else {
      this.commentTextarea.setAttribute('placeholder', 'Write a comment...');
    }
  }

  displayCharactersLimit() {
    if (this.commentTextarea.value.length > 0) {
      this.charactersLimit.classList.add('is-visible');
    } else {
      this.charactersLimit.classList.remove('is-visible');
    }
  }

  addCommentImage(event, self) {
    const maxFileSize = 15 * 1024 * 1024; // 15MB
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    this.comment = self;

    this.validationMediaError = null;

    if (selectedFile.size > maxFileSize) {
      this.errorMediaSnackbar.addMessage(
        'danger',
        'Invalid file format. Image should be max size 15 MB and valid formats - jpg, png.',
        'Error loading media',
        'Got it'
      );
      this.validationMediaError = true;
    } else {
      this.validationMediaError = false;
    }

    if (this.validationMediaError === false) {
      reader.onload = (e) => {
        this.comment.imageWrapper.querySelector('img').src = e.target.result;
        this.comment.imageWrapper.title = selectedFile.name;
        this.comment.imageWrapper.classList.add('is-visible');
      };

      reader.readAsDataURL(selectedFile);

      this.comment.changePublishBtnStatus();
    }
  }

  deleteCommentImage(self) {
    this.comment = self;

    this.comment.imageWrapper.classList.remove('is-visible');
    this.comment.imageWrapper.querySelector('img').src = '';
    this.comment.imageWrapper.title = '';

    this.comment.changePublishBtnStatus();
  }

  initAddDeleteCommentPhoto() {
    const self = this;
    const charLimitsCounter = new CharLimitsCounter(this.writeCommentBlock);

    this.addImageInput.addEventListener('change', (e) => {
      self.addCommentImage(e, self);
      charLimitsCounter.initCounter();
    });

    this.deleteImageBtn.addEventListener('click', () => {
      self.deleteCommentImage(self);
      charLimitsCounter.initCounter();
    });
  }

  changePublishBtnStatus() {
    if (
      this.imageWrapper.classList.contains('is-visible') ||
      this.commentTextarea.value.length !== 0
    ) {
      this.sendCommentBtn.disabled = false;
    } else {
      this.sendCommentBtn.disabled = true;
    }
  }

  publishComment(self) {
    const charLimitsCounter = new CharLimitsCounter(this.writeCommentBlock);
    // ajax request for posting comment

    this.commentTextarea.value = '';
    this.commentTextarea.style.height = '36px';
    this.commentTextarea.classList.remove('is-active');
    self.deleteCommentImage(self);
    charLimitsCounter.initCounter();

    if (this.commentsStat.classList.contains('is-hidden')) {
      this.commentsStat.classList.remove('is-hidden');
    }

    if (this.sorterOfComments.classList.contains('is-hidden')) {
      this.sorterOfComments.classList.remove('is-hidden');
    }

    const commentsCount = parseInt(this.commentsCountBlock.innerHTML, 10);
    this.newCommentCount = commentsCount + 1;
    this.commentsCountBlock.innerHTML = this.newCommentCount;
  }

  init() {
    this.changeTextareaPlaceholder();
    this.changeCommentTextareaStyle();

    const charLimitsCounter = new CharLimitsCounter(this.writeCommentBlock);

    this.commentTextarea.addEventListener('input', () => {
      this.changeCommentTextareaStyle();
      this.displayCharactersLimit();
      this.changePublishBtnStatus();
      charLimitsCounter.initCounter();
    });

    this.sendCommentBtn.addEventListener('click', () => {
      const self = this;
      this.publishComment(self);
    });

    this.initAddDeleteCommentPhoto();

    window.addEventListener('resize', () => {
      this.changeTextareaPlaceholder();
    });
  }
}

export default CommentCreation;
