import Swiper, { Autoplay,Navigation  } from "swiper";

class DiscoverCarousel {
  constructor() {
    this.slider = document.querySelector('.js-discover-carousel');
  }

  init() {
    if(this.slider){
      new Swiper('.js-discover-carousel', {
        slidesPerView: 1,
        speed: 1000,
        loop: true,
        autoplay: {
          delay: 7000,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        modules: [Navigation, Autoplay],
      });
    }
  }
}

export default DiscoverCarousel;
