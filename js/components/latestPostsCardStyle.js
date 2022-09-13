class LatestPostsCardStyle {
  constructor(card) {
    this.card = card;
    this.cardBody = card.querySelector('.js-news-card-body');
    this.cardText = card.querySelector('.js-news-card-text');
    this.cardMedia = card.querySelector('.js-news-card-media:not(.hidden)');
    this.sharedPost = card.querySelector(
      '.js-news-card-shared-post:not(.hidden)'
    );
    if (this.sharedPost) {
      this.sharedPostHeading = card.querySelector(
        '.js-news-card-shared-post-heading'
      );
      this.sharedPostBody = card.querySelector(
        '.js-news-card-shared-post-body'
      );
      this.sharedPostText = this.sharedPostBody.querySelector(
        '.js-news-card-shared-text'
      );
      this.sharedPostMedia = this.sharedPostBody.querySelector(
        '.js-news-card-shared-media'
      );
    }
  }

  setCardContentHeight() {
    let cardTextHeight;

    if (this.cardText && !this.cardText.classList.contains('hidden')) {
      cardTextHeight = this.cardText.offsetHeight + 16;
    } else {
      cardTextHeight = 0;
    }

    if (this.cardMedia) {
      const cardBodyHeight = this.cardBody.offsetHeight;
      this.cardMedia.style.height = `${cardBodyHeight - cardTextHeight}px`;
    }

    if (this.sharedPost) {
      let cardSharedTextHeight;

      if (!this.sharedPostText.classList.contains('hidden')) {
        cardSharedTextHeight = this.sharedPostText.offsetHeight + 8;
      } else {
        cardSharedTextHeight = 0;
      }

      const cardSharedBodyHeight =
        this.sharedPost.offsetHeight - this.sharedPostHeading.offsetHeight - 18;

      if (!this.sharedPostMedia.classList.contains('hidden')) {
        this.sharedPostMedia.style.height = `${
          cardSharedBodyHeight - cardSharedTextHeight
        }px`;
      }
    }
  }

  initSetCardContentHeight() {
    this.setCardContentHeight();
    window.addEventListener('resize', this.setCardContentHeight);
  }

  init() {
    if (this.cardBody) {
      this.initSetCardContentHeight();
    }
  }
}

export default LatestPostsCardStyle;
