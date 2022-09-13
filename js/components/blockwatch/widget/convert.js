class Convert {
  constructor() {
    this.convert = document.querySelector('.b-convert');

    if (this.convert) {
      this.rate = this.convert.dataset.rate;
      this.fromInput = this.convert.querySelector('.js-convert-from');
      this.toInput = this.convert.querySelector('.js-convert-to');
      this.fromInputValue =
        this.convert.querySelector('.js-convert-from').value;
      this.toInputValue = this.convert.querySelector('.js-convert-to').value;
    }
  }

  listeners() {
    this.fromInput.addEventListener('input', () => {
      this.fromInput.value = this.fromInput.value
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '');
      this.toInput.value = Number(this.fromInput.value * this.rate).toFixed(2);
    });

    this.toInput.addEventListener('input', () => {
      this.toInput.value = this.toInput.value
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '');
      this.fromInput.value = this.toInput.value / this.rate;
    });
  }

  init() {
    if (this.convert) {
      this.listeners();
    }
  }
}
export default Convert;
