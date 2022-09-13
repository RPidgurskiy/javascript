class ReadMore {
  constructor() {
    this.readMoreContainers = document.querySelectorAll('.js-read-more');
  }

  init() {
    if (this.readMoreContainers.length > 0) {
      this.readMoreContainers.forEach((container) => {
        const charsAmount = container.getAttribute('data-chars-amount');
        const rowsAmount = container.getAttribute('data-rows-amount');
        const textContainer = container.querySelector('.js-read-more-content');
        const toggler = container.querySelector('.js-read-more-toggler');

        if (charsAmount) {
          if (textContainer.textContent.length < charsAmount) {
            textContainer.nextElementSibling.classList.add('hidden');
          } else {
            const displayText = textContainer.innerHTML.slice(0, charsAmount);
            const showMoreText = textContainer.innerHTML.slice(charsAmount);

            textContainer.innerHTML = `${displayText}<span class="dots">...</span>
                <span class="hidden more-text">${showMoreText}</span>`;
          }

          if (toggler && !toggler.classList.contains('toggle-init')) {
            toggler.classList.add('toggle-init');

            toggler.addEventListener('click', () => {
              container.querySelector('.more-text').classList.toggle('hidden');
              container.querySelector('.dots').classList.toggle('hidden');
              if (toggler.textContent === 'See more') {
                toggler.textContent = 'See less';
              } else {
                toggler.textContent = 'See more';
              }
            });
          }
        }

        if (rowsAmount) {
          if (textContainer.classList.contains('is-trimmed')) {
            textContainer.classList.remove('is-trimmed');
          }

          if (toggler.classList.contains('hidden')) {
            toggler.classList.remove('hidden');
          }

          toggler.textContent = 'See more';

          const textHeight = textContainer.offsetHeight;
          const lineHeight = parseInt(textContainer.style.lineHeight, 10);
          const countOfTextLines = textHeight / lineHeight;

          if (countOfTextLines <= rowsAmount) {
            textContainer.nextElementSibling.classList.add('hidden');
          } else {
            textContainer.classList.add('is-trimmed');

            if (!toggler.classList.contains('toggle-init')) {
              toggler.classList.add('toggle-init');

              toggler.addEventListener('click', () => {
                textContainer.classList.toggle('is-trimmed');

                if (toggler.textContent === 'See more') {
                  toggler.textContent = 'See less';
                } else {
                  toggler.textContent = 'See more';
                }
              });
            }
          }
        }
      });
    }
  }
}

export default ReadMore;
