const dropdowns = (dropdown, targetItem) => {
  if (targetItem) {
    if (
      targetItem.classList.contains('js-dropdown-toggle') ||
      targetItem.closest('.js-dropdown-toggle')
    ) {
      dropdown.classList.toggle('open');
    }
  }

  document.addEventListener('click', (e) => {
    const parent = e.target.closest('.js-dropdown');

    if (dropdown) {
      if (
        !dropdown.contains(parent) &&
        !e.target.closest('.js-checkbox-setting-dropdown') &&
        dropdown.classList.contains('open')
      ) {
        dropdown.classList.remove('open');
      }
    }
  });
};

export default dropdowns;
