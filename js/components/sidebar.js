import $ from 'jquery';

window.jQuery = $;
require('../../../node_modules/theia-sticky-sidebar/dist/ResizeSensor.min');
require('../../../node_modules/theia-sticky-sidebar/dist/theia-sticky-sidebar.min');

const Sidebar = () => {
  const sidebar = document.querySelectorAll('.js-sidebar-sticky');

  const initSidebar = () => {
    if (sidebar.length > 0 && window.innerWidth > 767) {
      $('.js-sidebar-sticky').theiaStickySidebar({
        additionalMarginTop: 64,
        minWidth: 767,
      });
    }
  };

  initSidebar();

  window.addEventListener('resize', initSidebar);
};

export default Sidebar;
