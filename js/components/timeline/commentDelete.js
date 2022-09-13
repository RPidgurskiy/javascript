class CommentDelete {
  constructor(comment) {
    this.comment = comment;
    this.commentBlock = comment.closest('.js-comment-block');
    this.sorterOfComments = comment
      .closest('.js-comments-list-block')
      .querySelector('.js-comments-sorter');
    this.deleteCommentBtn = comment.querySelector('.js-delete-comment');
    this.commentsStat = comment
      .closest('.js-post')
      .querySelector('.js-comments-stat');
    this.commentsCountBlock = comment
      .closest('.js-post')
      .querySelector('.js-comments-amount');
    this.repliesBlockInner = this.commentBlock.querySelector(
      '.js-replies-block-inner'
    );
    this.repliesCount = Array.from(
      this.commentBlock.querySelectorAll('.js-count-of-replies')
    );
    this.newCommentCount = 0;
  }

  deleteComment(e) {
    const commentsCount = parseInt(this.commentsCountBlock.innerHTML, 10);
    const amountOfCommentReplies = Array.from(
      this.commentBlock.querySelectorAll('.js-comment-reply')
    ).length;
    let repliesAmount;

    if (e.target.closest('.js-comment-reply')) {
      e.target.closest('.js-comment-reply').remove();
      this.newCommentCount = commentsCount - 1;

      repliesAmount = parseInt(this.repliesCount[0].innerHTML, 10) - 1;

      this.repliesCount.forEach((item) => {
        const count = item;
        count.innerHTML = repliesAmount;
      });

      if (repliesAmount === 0) {
        this.repliesBlockInner.classList.remove('is-visible');
      }
    } else {
      this.commentBlock.remove();
      this.newCommentCount = commentsCount - 1 - amountOfCommentReplies;
    }

    this.commentsCountBlock.innerHTML = this.newCommentCount;

    if (this.newCommentCount === 0) {
      this.commentsStat.classList.add('is-hidden');
      this.sorterOfComments.classList.add('is-hidden');
    }

    // ajax request
  }

  init(e) {
    if (
      e.target.classList.contains('js-delete-comment') ||
      e.target.closest('.js-delete-comment')
    ) {
      this.deleteComment(e);
    }
  }
}

export default CommentDelete;
