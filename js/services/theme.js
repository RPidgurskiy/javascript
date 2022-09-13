class Theme {
  constructor() {
    this.path = window.location.pathname;
    this.html = document.querySelector('html');
    this.body = document.querySelector('body');
    this.switcher = document.querySelector('#switch');
    if (this.switcher) {
      this.slider = this.switcher.querySelector('#slider');
    }
    this.userId = document.querySelector('#userId').value;
    if (this.switcher && this.userId !== '') {
      this.userConfig = {
        configuration: JSON.parse(document.querySelector('#userConfig').value),
      };
      this.currentTheme =
        this.userConfig.configuration.theme === 'light' ? 'light' : 'dark';
    }
  }

  toggleTheme() {
    if (this.currentTheme === 'light') {
      this.currentTheme = 'dark';
      this.html.classList.add('theme-dark');

    } else {
      this.currentTheme = 'light';
      this.html.classList.remove('theme-dark');
    }
    this.userConfig.configuration.theme = this.currentTheme;
    this.updateUserConfig().then();
  }

  updateUserConfig() {
    if (this.userId !== '') {
      return fetch(`/v2/api/users/${this.userId}/configuration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.userConfig),
      });
    }
    return '';
  }

  init() {
    if (this.switcher) {
      this.slider.checked = this.currentTheme === 'dark';
      this.switcher.addEventListener('change', () => {
        this.toggleTheme();
      });
    }
  }
}

export default Theme;
