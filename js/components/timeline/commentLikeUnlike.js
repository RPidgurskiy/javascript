class CommentLikeUnlike {
  constructor(comment) {
    this.comment = comment;
    this.likeCommentBtn = comment.querySelector('.js-like-comment-btn');
    this.likedText = comment.querySelector('.js-liked-comment-text');
    this.likeText = comment.querySelector('.js-like-comment-text');
    this.likesAmountBlock = comment.querySelector('.js-comment-likes-amount');
    this.likeBtn = comment.querySelector('.js-likes-preview-btn');
    this.likeBtnFullSvg = comment.querySelector('.js-comment-like-full-svg');
    this.likeBtnSvg = comment.querySelector('.js-comment-like-svg');
  }

  likeUnlikeComment() {
    let likesAmount = parseInt(this.likesAmountBlock.innerHTML, 10);

    if (this.likeCommentBtn.classList.contains('is-active')) {
      this.likeCommentBtn.classList.remove('is-active');
      this.likeBtnSvg.classList.remove('is-hidden');
      this.likeBtnFullSvg.classList.add('is-hidden');
      this.likedText.classList.add('is-hidden');
      this.likeText.classList.remove('is-hidden');
      this.likesAmountBlock.innerHTML = likesAmount - 1;
      likesAmount -= 1;
    } else {
      this.likeCommentBtn.classList.add('is-active');
      this.likeBtnSvg.classList.add('is-hidden');
      this.likeBtnFullSvg.classList.remove('is-hidden');
      this.likedText.classList.remove('is-hidden');
      this.likeText.classList.add('is-hidden');
      this.likesAmountBlock.innerHTML = likesAmount + 1;
      likesAmount += 1;
    }

    if (likesAmount === 0 && !this.likeBtn.classList.contains('is-hidden')) {
      this.likeBtn.classList.add('is-hidden');
    } else if (
      likesAmount > 0 &&
      this.likeBtn.classList.contains('is-hidden')
    ) {
      this.likeBtn.classList.remove('is-hidden');
    }
  }

  init() {
    this.likeUnlikeComment();
  }
}

export default CommentLikeUnlike;
