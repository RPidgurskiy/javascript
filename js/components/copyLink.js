class CopyLink {
  constructor(copyBtn) {
    this.copyBtn = copyBtn;
    this.copiedLink = copyBtn.getAttribute('data-link');
  }

  copyPostLink() {
    const temporaryTextarea = document.createElement('textarea');
    document.querySelector('body').appendChild(temporaryTextarea);
    temporaryTextarea.value = this.copiedLink;
    temporaryTextarea.select();
    document.execCommand('copy');
    temporaryTextarea.remove();
  }

  init() {
    this.copyBtn.addEventListener('click', () => {
      this.copyPostLink();
    });
  }
}

export default CopyLink;
