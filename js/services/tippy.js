import tippy from 'tippy.js';

class Tippy {
  init = () => {
    tippy('.js-add-photo-input', {
      content: 'Image',
      placement: 'bottom',
    });

    tippy('.js-add-video-input', {
      content: 'Video',
      placement: 'bottom',
    });
  };
}

export default Tippy;
