import tippy from 'tippy.js';

const tippySidebar = () => {
  const sidebarLinkWrapper = document.querySelector('.left-sidebar');
  const sidebarToggler = document.querySelectorAll('.js-open-mob-menu');
  let tippys;
  if (sidebarLinkWrapper) {

    tippys = tippy('.tippy-sidebar', {
      placement: 'right',
      arrow: true,
      animation: 'scale',
      content: (reference) => reference.getAttribute('link-tooltip'),
    });
    sidebarToggler.forEach((sidebar) => {
      sidebar.addEventListener('click', () => {
        if (!sidebar.classList.contains('open')) {
          tippys.forEach((t) => {
            t.enable();
          });
        } else {
          tippys.forEach((t) => {
            t.disable();
          });
        }
      });
    });
  }
};

export default tippySidebar;
