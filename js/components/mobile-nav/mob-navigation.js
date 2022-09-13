const mobNav = () => {
  const contentMenu = document.querySelector('#contnet');
  const OpenMobMenu = contentMenu.querySelector('.js-open-mob-menu');
  const NavMenu = contentMenu.querySelector('.nav-sidebar');

  if (contentMenu) {
    if (OpenMobMenu) {
      OpenMobMenu.addEventListener('click', () => {
        NavMenu.classList.toggle('open');
        OpenMobMenu.classList.toggle('open');
      });
    }
  }
};

export default mobNav;
