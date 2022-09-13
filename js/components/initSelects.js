import 'select2';

import $ from 'jquery';

const initSelects = () => {
  function formatState(state) {
    // const data = $(state.element).data('img');

    if (!state.id) {
      return state.text;
    }
    const $state = $(`<div class="select2-item">${state.text}</div>`);

    return $state;
  }

  $('.js-post-privacy-select').select2({
    templateResult: formatState,
  });
};

export default initSelects;
