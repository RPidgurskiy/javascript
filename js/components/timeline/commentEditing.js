import CharLimitsCounter from '../char-limits';

class CommentEditing {
  constructor(commentBlock) {
    this.commentBlock = commentBlock;
    this.comment = commentBlock.querySelector('.js-comment');
    this.commentText = commentBlock.querySelector('.js-comment-text');
    this.commentImage = commentBlock.querySelector(
      '.js-comment-published-image'
    );
    this.editCommentBlock = commentBlock.querySelector(
      '.js-write-comment-block'
    );
    this.editCommentBtn = commentBlock.querySelector('.js-edit-comment-btn');
    this.editCommentTextarea = commentBlock.querySelector(
      '.js-comment-textarea'
    );
    this.editCommentImage = commentBlock.querySelector('.js-comment-image');
    this.editCommentImageBlock = commentBlock.querySelector(
      '.js-comment-image-wrapper'
    );
    this.sendEditedCommentBtn =
      this.editCommentBlock.querySelector('.js-textarea-btn');
  }

  editComment() {
    this.comment.classList.add('is-hidden');
    this.editCommentBlock.classList.add('is-visible');

    if (this.commentText && this.commentText.textContent !== 0) {
      this.editCommentTextarea.value = this.commentText.textContent.trim();
      const charLimitsCounter = new CharLimitsCounter(this.editCommentBlock);
      charLimitsCounter.initCounter();
      let height;

      const setHeight = () => {
        if (!this.editCommentTextarea.closest('.js-media-preview-modal')) {
          if (window.innerWidth > 1368) {
            height = (this.editCommentTextarea.value.length / 66) * 20 + 36;
          } else if (window.innerWidth > 1200) {
            height = (this.editCommentTextarea.value.length / 54) * 20 + 36;
          } else if (window.innerWidth > 768) {
            height = (this.editCommentTextarea.value.length / 34) * 20 + 36;
          } else if (window.innerWidth > 368) {
            height = (this.editCommentTextarea.value.length / 26) * 20 + 36;
          } else if (window.innerWidth > 0) {
            height = (this.editCommentTextarea.value.length / 22) * 20 + 36;
          }
        } else if (
          this.editCommentTextarea.closest('.js-media-preview-modal')
        ) {
          if (window.innerWidth > 1368) {
            height = (this.editCommentTextarea.value.length / 66) * 20 + 66;
          } else if (window.innerWidth > 1200) {
            height = (this.editCommentTextarea.value.length / 54) * 20 + 66;
          } else if (window.innerWidth > 768) {
            height = (this.editCommentTextarea.value.length / 34) * 20 + 66;
          } else if (window.innerWidth > 368) {
            height = (this.editCommentTextarea.value.length / 26) * 20 + 66;
          } else if (window.innerWidth > 0) {
            height = (this.editCommentTextarea.value.length / 22) * 20 + 66;
          }
        }

        if (height < 40) {
          height = 20;
        }

        this.editCommentTextarea.style.height = `${height}px`;
      };

      setHeight();

      window.addEventListener('resize', () => {
        setHeight();
      });

      if (height >= 40) {
        this.editCommentTextarea.classList.add('is-active');
      }
    }

    if (this.commentImage) {
      const commentImageSrc = this.commentImage.getAttribute('src');
      this.editCommentImage.setAttribute('src', commentImageSrc);
      this.editCommentImageBlock.classList.add('is-visible');
    }
  }

  sendEditedComment() {
    this.comment.classList.remove('is-hidden');
    this.editCommentBlock.classList.remove('is-visible');

    // ajax for updating content of comment
  }

  listeners(e) {
    this.editComment();
    e.target.closest('.js-dropdown').classList.remove('open');

    document.addEventListener('click', (event) => {
      if (
        event.target.classList.contains('js-textarea-btn') ||
        event.target.closest('.js-textarea-btn')
      ) {
        this.sendEditedComment();
      }
    });
  }

  init(e) {
    this.listeners(e);
  }
}

export default CommentEditing;
