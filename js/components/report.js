import axios from 'axios';

import CustomModal from './custom-modal';
import Snackbar from './snackbar';

class Report {
  constructor() {
    this.reportForm = document.querySelector('.js-report-form');
    this.snackbar = new Snackbar();
    this.location = window.location.origin;
    this.textArea = document.querySelector('.js-report-text');
    this.modal = new CustomModal('report');
  }

  listeners() {
    if (this.reportForm) {
      this.reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitReportBtn = document.querySelector('.js-submit-btn');
        const inputCoinId = document.querySelector('.coin_page_id').value;
        const reportText = document.querySelector('.js-report-text').value;
        axios
          .post(`${this.location}/v2/api/reports`, {
            type: 'page',
            text: reportText,
            entity_id: inputCoinId,
          })
          .then(() => {
            // eslint-disable-next-line no-console
            this.submitReportBtn.setAttribute('disabled', 'true');
            setTimeout(() => {
              this.textArea.value = '';
              this.snackbar.addMessage('success', 'Report has been sent');
              this.modal.close();
            }, 1000);
          })
          .catch((err) => {
            this.snackbar.addMessage(
              'danger',
              'Report should consist of at least 8 symbols'
            );
            throw err;
          });
      });
    }
  }

  init() {
    this.listeners();
  }
}
export default Report;
