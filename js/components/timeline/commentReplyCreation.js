import CharLimitsCounter from '../char-limits';

class CommentReplyCreation {
  constructor(commentBlock) {
    this.commentsBlock = commentBlock;
    this.repliesBlockInner = commentBlock.querySelector(
      '.js-replies-block-inner'
    );
    this.replyBtn = commentBlock.querySelector('.js-write-reply-btn');
    this.namedReplyBtns = Array.from(
      commentBlock.querySelectorAll('.js-write-named-reply-btn')
    );
    this.replyBlock = commentBlock.querySelector('.js-comment-reply-block');
    this.replyTextarea = this.replyBlock.querySelector('.js-comment-textarea');
    this.repliesCount = Array.from(
      commentBlock.querySelectorAll('.js-count-of-replies')
    );
    this.commentsCount = commentBlock
      .closest('.js-post')
      .querySelector('.js-comments-amount');
    this.sendReplyBtnArray = Array.from(
      commentBlock.querySelectorAll('.js-textarea-btn')
    );
    this.sendReplyBtn =
      this.sendReplyBtnArray[this.sendReplyBtnArray.length - 1];
    this.repliesAmount = 0;
  }

  replyToComment() {
    this.replyBlock.classList.add('is-visible');
    this.replyTextarea.value = '';
    this.replyTextarea.focus();
    const charLimitsCounter = new CharLimitsCounter(this.replyBlock);
    charLimitsCounter.initCounter();

    if (window.innerWidth <= 420) {
      this.replyTextarea.classList.add('is-active');
      this.replyTextarea.style.height = '62px';
    }
  }

  replyToReply(e) {
    this.replyBlock.classList.add('is-visible');
    const replyUsername = e.target
      .closest('.js-comment')
      .querySelector('.js-comment-author')
      .getAttribute('data-username');
    this.replyTextarea.value = `@${replyUsername} `;
    this.replyTextarea.focus();
    const charLimitsCounter = new CharLimitsCounter(this.replyBlock);
    charLimitsCounter.initCounter();

    if (window.innerWidth <= 420) {
      this.replyTextarea.classList.add('is-active');
      this.replyTextarea.style.height = '62px';
    }
  }

  cancelReplyToComment() {
    // ajax for adding new reply to comment into js-replies-wrapper

    this.repliesAmount = parseInt(this.repliesCount[0].innerHTML, 10) + 1;

    if (
      !this.repliesBlockInner.classList.contains('is-visible') &&
      this.repliesAmount !== 0
    ) {
      this.repliesBlockInner.classList.add('is-visible');
    }

    this.repliesCount.forEach((item) => {
      const count = item;
      count.innerHTML = this.repliesAmount;
    });

    this.replyTextarea.value = '';
    this.replyTextarea.classList.remove('is-active');
    this.replyBlock.classList.remove('is-visible');
  }

  init(e) {
    if (e.target.classList.contains('js-write-reply-btn')) {
      this.replyToComment();
    }

    if (e.target.classList.contains('js-write-named-reply-btn')) {
      this.replyToReply(e);
    }

    if (e.target.classList.contains('js-textarea-btn')) {
      this.cancelReplyToComment();
    }
  }
}

export default CommentReplyCreation;
