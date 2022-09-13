function regExValidation(name, value) {
  if (name === 'pageName') {
    const pageName = /^.{3,40}$/;
    return pageName.test(value);
  }
  if (name === 'coinUrl') {
    const coinUrl = /^[\S]{3,40}$/;
    return coinUrl.test(value);
  }
  if (name === 'coinName') {
    const coinName = /^[a-zA-Z0-9 _]{1,256}$/;
    return coinName.test(value);
  }
  if (name === 'coinTicker') {
    const coinTicker = /^[\S]{2,256}$/;
    return coinTicker.test(value);
  }
  if (name === 'reportText') {
    const reportText = /.{8,}$/;
    return reportText.test(value);
  }
  if (name === 'linkUrl') {
    const linkUrl =
      /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/;
    return linkUrl.test(value);
  }
  return true;
}

function validateField(ref, required, name) {
  const { value } = ref;
  if (value.length >= 1) {
    return regExValidation(name, ref.value);
  }
  if (required && value.length < 1) {
    return false;
  }
  return true;
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertAlertMessage(field, text) {
  const errorHint = field.parentNode.querySelector('.js-error-hint');
  if (!errorHint) {
    const alertBlock = document.createElement('div');
    alertBlock.classList.add('error-hint', 'js-error-hint');
    alertBlock.innerHTML = text;
    insertAfter(field, alertBlock);
  }
}

function removeAlertMessage(field) {
  const errorHint = field.parentNode.querySelector('.js-error-hint');
  if (errorHint) {
    errorHint.remove();
  }
}

class FormValidation {
  constructor(formRef) {
    this.formRef = formRef;
    this.fields = [];
    this.formErrors = 0;
    this.getFields();
    this.onChange(this.fields);
    this.errorMessage = {
      pageName: 'Page name should include 3-40 symbols',
      coinUrl: 'Page URL include 3-40 symbols, no spaces, no special symbols',
      coinName: 'Coin name should include 3-256 symbols',
      coinTicker: 'Coin ticker should include 1-256 symbols',
      reportText: 'Report should consist of at least 8 symbols',
      coinPassword: '',
      linkUrl: 'Website link is incorrect',
    };
  }

  getFields() {
    this.formRef.querySelectorAll('input:not(.is-hidden)').forEach((field) => {
      this.fields.push(field);
    });
    this.formRef
      .querySelectorAll('textarea:not(.is-hidden)')
      .forEach((field) => {
        this.fields.push(field);
      });
  }

  onChange(fields) {
    const submitButton = this.formRef.querySelector('.js-submit-btn');
    const textareaValid = this.formRef.querySelector('.js-form-characters');

    fields.forEach((field) => {
      const required = field.getAttribute('required') != null;
      let name;

      if (field.classList.contains('js-socials-input')) {
        name = 'linkUrl';
      } else {
        name = field.getAttribute('name');
      }

      field.addEventListener('change', () => {
        this.formErrors = 0;

        fields.forEach((item) => {
          const names = item.getAttribute('name');
          const requiredFields = item.getAttribute('required') != null;
          if (!validateField(item, requiredFields, names)) {
            this.formErrors += 1;
          }
        });

        if (!validateField(field, required, name)) {
          field.classList.add('error');
          insertAlertMessage(field, this.errorMessage[name]);
        } else {
          field.classList.remove('error');
          removeAlertMessage(field);
        }
        if (submitButton) {
          if (
            this.formErrors > 0 ||
            (textareaValid && textareaValid.classList.contains('is-error'))
          ) {
            submitButton.setAttribute('disabled', 'true');
          } else {
            submitButton.removeAttribute('disabled');
          }
        }
      });
    });
  }
}
function validateForm() {
  const forms = document.querySelectorAll('form:not(.js-no-validate)');

  forms.forEach((form) => {
    form.setAttribute('novalidate', 'novalidate');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  validateForm();
});

export default FormValidation;
