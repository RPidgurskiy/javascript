class BtnContentChange {
  constructor(btn) {
    this.btn = btn;
    this.idForAjax = btn.getAttribute('data-id');
    this.firstText = btn.querySelector('.js-btn-text-first');
    this.secondText = btn.querySelector('.js-btn-text-second');
  }

  changeBtnStatus() {
    if (this.firstText.classList.contains('is-hidden')) {
      this.firstText.classList.remove('is-hidden');
      this.secondText.classList.add('is-hidden');
    } else {
      this.firstText.classList.add('is-hidden');
      this.secondText.classList.remove('is-hidden');
    }

    if (this.btn.classList.contains('js-report-user-btn')) {
      // ajax for change date about report/unreport
    }

    if (this.btn.classList.contains('js-block-user-btn')) {
      // ajax for change date about block/unblock user
    }

    if (this.btn.classList.contains('js-save-post-btn')) {
      // ajax for change date about save/unsave post
    }

    if (this.btn.classList.contains('js-report-post-btn')) {
      // ajax for change date about report/unreport post
    }

    if (this.btn.classList.contains('js-report-photo-btn')) {
      // ajax for change date about report/unreport photo
    }

    if (this.btn.classList.contains('js-join-to-event')) {
      // ajax for change date about join/joined to event
    }

    if (this.btn.classList.contains('js-interested-in-event')) {
      // ajax for change date about interested in event
    }
  }

  listeners() {
    this.changeBtnStatus();
  }

  init() {
    this.listeners();
  }
}

export default BtnContentChange;
