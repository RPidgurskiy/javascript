class CommentMoreLoading {
  constructor(commentBlock) {
    this.commentsBlock = commentBlock;
    this.amountOfComments = parseInt(
      commentBlock.getAttribute('data-comments'),
      10
    );
    this.viewMoreBtn = commentBlock.querySelector('.js-show-comments-btn');
    this.viewMoreBtnCount = commentBlock.querySelector(
      '.js-show-comments-btn-count'
    );
    this.hideBtn = commentBlock.querySelector('.js-hide-comments-btn');
    this.loadedCommentsWrapper = commentBlock.querySelector(
      '.js-loaded-comments-wrapper'
    );
  }

  viewMoreComments() {
    const loadedCommentsAmount = Array.from(
      this.loadedCommentsWrapper.querySelectorAll('.js-comment-block')
    ).length;

    if (loadedCommentsAmount === this.amountOfComments - 2) {
      this.hideBtn.classList.add('is-visible');
      this.viewMoreBtn.classList.remove('is-visible');
      this.loadedCommentsWrapper.classList.remove('is-hidden');
    } else {
      // ajax for loading more 10 comments and inserting to this.loadedCommentsWrapper
      // at the end of ajax request check:
      // loadedCommentsAmount = Array.from(this.loadedCommentsWrapper.querySelectorAll('.js-comment-block')).length;
      // if(loadedCommentsAmount === this.amountOfComments - 2) {
      // this.hideBtn.classList.add('is-visible');
      // this.viewMoreBtn.classList.remove('is-visible');} else {
      this.viewMoreBtnCount.innerHTML =
        this.amountOfComments - loadedCommentsAmount - 2;
    }
  }

  hideMoreComments() {
    this.loadedCommentsWrapper.classList.add('is-hidden');
    this.hideBtn.classList.remove('is-visible');
  }

  listeners(e) {
    if (e.target.classList.contains('js-show-comments-btn')) {
      this.viewMoreComments();
    }

    if (e.target.classList.contains('js-hide-comments-btn')) {
      this.hideMoreComments();
    }
  }

  init(e) {
    this.listeners(e);
  }
}

export default CommentMoreLoading;
