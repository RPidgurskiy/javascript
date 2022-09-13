class CommentRepliesToggle {
  constructor(commentsBlock) {
    this.commentsBlock = commentsBlock;
    this.viewAllRepliesBtn = commentsBlock.querySelector(
      '.js-view-all-replies'
    );
    this.hideAllRepliesBtn = commentsBlock.querySelector(
      '.js-hide-all-replies'
    );
    this.repliesWrapper = commentsBlock.querySelector('.js-replies-wrapper');
  }

  viewReplies() {
    this.repliesWrapper.classList.add('is-visible');
    // ajax
    this.hideAllRepliesBtn.classList.remove('is-hidden');
    this.viewAllRepliesBtn.classList.add('is-hidden');
  }

  hideReplies() {
    this.repliesWrapper.classList.remove('is-visible');
    this.hideAllRepliesBtn.classList.add('is-hidden');
    this.viewAllRepliesBtn.classList.remove('is-hidden');
  }

  init(e) {
    if (
      e.target.classList.contains('js-view-all-replies') ||
      e.target.closest('.js-view-all-replies')
    ) {
      this.viewReplies();
    } else if (
      e.target.classList.contains('js-hide-all-replies') ||
      e.target.closest('.js-hide-all-replies')
    ) {
      this.hideReplies();
    }
  }
}

export default CommentRepliesToggle;
