class JsTabTriggers {
  constructor() {
    this.jsTriggers = document.querySelectorAll('.js-tab-trigger');
  }

  listeners() {
    if (this.jsTriggers) {
      this.jsTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          this.idTab = trigger.getAttribute('data-tab');
          this.content = document.querySelector(
            `.js-tab-content[data-tab="${this.idTab}"]`
          );
          this.activeTrigger = document.querySelector('.js-tab-trigger.active');
          this.activeContent = document.querySelector('.js-tab-content.active');

          this.activeTrigger.classList.remove('active');
          trigger.classList.add('active');

          this.activeContent.classList.remove('active');
          this.content.classList.add('active');
        });
      });
    }
  }

  init() {
    this.listeners();
  }
}

export default JsTabTriggers;
