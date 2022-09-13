import Snackbar from './snackbar';

class CopyLinkToClipboard {
  constructor() {
    this.snackbar = new Snackbar();
  }

  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.snackbar.addMessage('info', 'Copied to the clipboard.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => {
        this.snackbar.addMessage('info', 'Copied to the clipboard.');
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('Async: Could not copy text: ', err);
      }
    );
  }

  listeners() {
    let link;

    const insertLink = () => {
      const linkText = link.dataset.copyLink;
      const linkFull = `${linkText}`;
      this.copyTextToClipboard(linkFull);
    };

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('js-copy-link')) {
        link = e.target;
        insertLink();
      } else if (e.target.closest('.js-copy-link')) {
        link = e.target.closest('.js-copy-link');
        insertLink();
      }
    });
  }

  init() {
    this.listeners();
  }
}

export default CopyLinkToClipboard;
