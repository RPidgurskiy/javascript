class Snackbar {
  constructor(type) {
    // Types of snackbar - danger, alert, info, success
    this.type = type;

    // svg icons
    this.svg = {
      danger: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.833252 10C0.833252 15.0626 4.93731 19.1667 9.99992 19.1667C15.0625 19.1667 19.1666 15.0626 19.1666 10C19.1666 4.9374 15.0625 0.833344 9.99992 0.833344C4.93731 0.833344 0.833252 4.9374 0.833252 10ZM17.4999 10C17.4999 14.1421 14.1421 17.5 9.99992 17.5C5.85778 17.5 2.49992 14.1421 2.49992 10C2.49992 5.85787 5.85778 2.50001 9.99992 2.50001C14.1421 2.50001 17.4999 5.85787 17.4999 10ZM10.0002 14.9986C10.4606 14.9986 10.8338 14.6255 10.8338 14.1653C10.8338 13.7051 10.4606 13.332 10.0002 13.332C9.5398 13.332 9.16659 13.7051 9.16659 14.1653C9.16659 14.6255 9.5398 14.9986 10.0002 14.9986ZM10.8363 4.99863H9.16905V11.6653H10.8363V4.99863Z" fill="#D43C52"/>
                </svg>`,
      close: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1726 9.99416L16.6549 4.51182L15.4764 3.33331L9.99407 8.81564L4.51176 3.33334L3.33325 4.51185L8.81556 9.99415L3.33337 15.4763L4.51188 16.6548L9.99407 11.1727L15.4763 16.6549L16.6548 15.4764L11.1726 9.99416Z" fill="#73747B"/>
                    </svg>`,
      success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99992 19.1666C4.93731 19.1666 0.833252 15.0626 0.833252 9.99998C0.833252 4.93737 4.93731 0.833313 9.99992 0.833313C15.0625 0.833313 19.1666 4.93737 19.1666 9.99998C19.1666 15.0626 15.0625 19.1666 9.99992 19.1666ZM9.99992 17.5C14.1421 17.5 17.4999 14.1421 17.4999 9.99998C17.4999 5.85784 14.1421 2.49998 9.99992 2.49998C5.85778 2.49998 2.49992 5.85784 2.49992 9.99998C2.49992 14.1421 5.85778 17.5 9.99992 17.5ZM12.744 6.91072L8.33325 11.3215L6.42251 9.41072L5.24399 10.5892L8.33325 13.6785L13.9225 8.08923L12.744 6.91072Z" fill="#33B175"/>
                    </svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.833496 9.99998C0.833496 15.0626 4.93755 19.1666 10.0002 19.1666C15.0628 19.1666 19.1668 15.0626 19.1668 9.99998C19.1668 4.93737 15.0628 0.833313 10.0002 0.833313C4.93755 0.833313 0.833496 4.93737 0.833496 9.99998ZM17.5002 9.99998C17.5002 14.1421 14.1423 17.5 10.0002 17.5C5.85803 17.5 2.50016 14.1421 2.50016 9.99998C2.50016 5.85784 5.85803 2.49998 10.0002 2.49998C14.1423 2.49998 17.5002 5.85784 17.5002 9.99998ZM10.8365 11.6653H11.6693V13.3319H8.33596V11.6653H9.1693V9.9986H8.33596V8.33193H10.8365V11.6653ZM10.834 6.66527C10.834 7.1255 10.4608 7.4986 10.0004 7.4986C9.54005 7.4986 9.16683 7.1255 9.16683 6.66527C9.16683 6.20503 9.54005 5.83193 10.0004 5.83193C10.4608 5.83193 10.834 6.20503 10.834 6.66527Z" fill="#73747B"/>
</svg>
`,
      alert: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.7012 13.2943L12.8634 3.3147C12.2773 2.29869 11.185 1.66807 10.0036 1.66669C8.82214 1.66531 7.7294 2.29332 7.13603 3.31474L1.29609 13.298C0.690524 14.3163 0.676825 15.5921 1.26338 16.6327C1.85042 17.6741 2.94961 18.3222 4.14523 18.3319L15.8435 18.332C17.0515 18.3202 18.1486 17.6741 18.7356 16.6336C19.3218 15.5944 19.3087 14.3213 18.7012 13.2943ZM2.73162 14.1448L8.5759 4.15411C8.87186 3.64464 9.41469 3.33267 10.0017 3.33335C10.5886 3.33404 11.1312 3.6473 11.4223 4.15187L17.2646 14.1394C17.5709 14.6571 17.5774 15.2944 17.2839 15.8147C16.99 16.3358 16.4405 16.6594 15.8353 16.6653L4.152 16.6653C3.55983 16.6604 3.00924 16.3358 2.71525 15.8143C2.42159 15.2933 2.42844 14.6546 2.73162 14.1448ZM10.0002 14.9986C10.4606 14.9986 10.8338 14.6255 10.8338 14.1653C10.8338 13.7051 10.4606 13.332 10.0002 13.332C9.53979 13.332 9.16657 13.7051 9.16657 14.1653C9.16657 14.6255 9.53979 14.9986 10.0002 14.9986ZM10.8362 6.66531H9.16903V12.4986H10.8362V6.66531Z" fill="#F2994A"/>
                       </svg>`,
    };

    // creating and adding to page snackbar wrapper
    this.snackbarWrapper = document.createElement('div');
    this.createSnackbar();
  }

  createSnackbar() {
    this.snackbarWrapper.classList.add('s-bar-wrapper');
    document.body.append(this.snackbarWrapper);
  }

  addMessage(type, text, title = '', action = '') {
    let icon;
    let snackbarContent;

    // set icon depending on snackbar type
    if (type === 'info') {
      icon = this.svg.info;
    } else if (type === 'success') {
      icon = this.svg.success;
    } else if (type === 'danger') {
      icon = this.svg.danger;
    } else {
      icon = this.svg.alert;
    }

    // snackbar content markup template if title exists or not
    if (title) {
      snackbarContent = `
                <div class="s-bar__title">
                    ${title}
                </div>
                <div class="s-bar__text">
                    ${text}
                </div>
                `;
    } else {
      snackbarContent = `
                <div class="s-bar__text">
                    ${text}
                </div>
                `;
    }

    // snackbar body markup
    const snackbarBody = `
                <div class="s-bar__inner">
                  <div class="s-bar__body">
                      <div class="s-bar__icon">
                          ${icon}
                      </div>
                       <div class="s-bar__content">
                          ${snackbarContent}
                       </div>
                  </div>
                  <div class="s-bar__close">${this.svg.close}</div>
                </div>
                <button class="s-bar__action s-bar__close c-link" type="button">${action}</button>
            `;

    // create snackbar card
    const sBar = document.createElement('div');
    sBar.classList.add('s-bar');
    sBar.innerHTML = snackbarBody;

    if (action === '') {
      const actionBtn = sBar.querySelector('.s-bar__action');
      actionBtn.remove();
    }

    // Append snackbar to wrapper
    this.snackbarWrapper.append(sBar);

    // Close btn event listener
    const closeBtns = document.querySelectorAll('.s-bar__close');

    if (closeBtns.length > 0) {
      closeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const bar = btn.closest('.s-bar');
          bar.remove();
        });
      });
    }

    // Delete snackbar after 3500 ms or 5000 ms
    if (sBar && action === '') {
      setTimeout(() => {
        sBar.remove();
      }, 3500);
    } else if (sBar && action !== '') {
      setTimeout(() => {
        sBar.remove();
      }, 5000);
    }
  }
}

export default Snackbar;
