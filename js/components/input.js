class Input {
  constructor() {
    this.inputEye = document.querySelectorAll('.js-eye');
  }

  init() {
    if (this.inputEye.length > 0) {
      this.inputEye.forEach((eye) => {
        eye.addEventListener('click', () => {
          const input = eye.parentElement.querySelector('input');

          if (eye.classList.contains('active')) {
            eye.classList.remove('active');
            input.setAttribute('type', 'password');
          } else {
            eye.classList.add('active');
            input.setAttribute('type', 'text');
          }
        });
      });
    }
  }
}
export default Input;
