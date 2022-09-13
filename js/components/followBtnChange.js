class FollowBtnChange {
  constructor(followBtnWrapper) {
    this.followBtnWrapper = followBtnWrapper;
    this.userId = followBtnWrapper.getAttribute('data-user-id');
    this.followBtn = followBtnWrapper.querySelector('.js-follow-btn');
    this.followingBtn = followBtnWrapper.querySelector('.js-following-btn');
    this.requestedBtn = followBtnWrapper.querySelector('.js-requested-btn');
    this.messageBtn = followBtnWrapper.querySelector('.js-message-btn');
  }

  changeBtnStatus() {
    if (
      this.followBtnWrapper.classList.contains('js-user-need-request') &&
      this.followBtn.classList.contains('is-visible')
    ) {
      this.followBtn.classList.remove('is-visible');
      this.requestedBtn.classList.add('is-visible');
      // ajax
    } else if (this.requestedBtn.classList.contains('is-visible')) {
      this.requestedBtn.classList.remove('is-visible');
      this.followBtn.classList.add('is-visible');
      // ajax
    } else if (
      !this.followBtnWrapper.classList.contains('js-user-need-request') &&
      this.followBtn.classList.contains('is-visible') &&
      this.messageBtn
    ) {
      this.followBtn.classList.remove('is-visible');
      this.messageBtn.classList.add('is-visible');
      // ajax
    } else if (
      !this.followBtnWrapper.classList.contains('js-user-need-request') &&
      this.followBtn.classList.contains('is-visible') &&
      this.followingBtn
    ) {
      this.followBtn.classList.remove('is-visible');
      this.followingBtn.classList.add('is-visible');
      // ajax
    } else if (
      !this.followBtnWrapper.classList.contains('js-user-need-request') &&
      this.followingBtn &&
      this.followingBtn.classList.contains('is-visible')
    ) {
      this.followingBtn.classList.remove('is-visible');
      this.followBtn.classList.add('is-visible');
      // ajax
    }
  }

  listeners() {
    this.changeBtnStatus();
  }

  init() {
    this.listeners();
  }
}

export default FollowBtnChange;
