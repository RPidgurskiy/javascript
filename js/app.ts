import CoinJS from './components/blockwatch/coin';
import ProfileSettings from './components/blockwatch/coin/profile-settings';
import JsTabTriggers from './components/blockwatch/coin-type-tab';
import BtnContentChange from './components/btnContentChange';
import CharLimitsCounter from './components/char-limits';
import ClassSelect2 from './components/class-select2';
import Community from "./components/community";
import CopyLinkToClipboard from './components/copyLinkToClipboard';
import DiscoverCarousel from "./components/discoverCarousel";
import DiscoverPagesGrid from "./components/discoverPagesGrid";
import dropdowns from './components/dropdowns';
import FollowBtnChange from './components/followBtnChange';
import initSelects from './components/initSelects';
import Input from './components/input';
import LinkTrimming from './components/linkTrimming';
import Editor from './components/medium-editor';
import mobNav from './components/mobile-nav/mob-navigation';
import MobileSearch from './components/mobile-search';
import Report from './components/report';
import Sidebar from './components/sidebar';
import AddEmoji from './components/timeline/addEmoji';
import InitTimeline from './components/timeline/initTimeline';
import LoadAjaxLinks from './services/load-ajax-links';
import ReadMore from './services/read-more';
import tippySidebar from './services/side-menu';
import Theme from './services/theme';
import Tippy from './services/tippy';
import FormValidation from './services/validation';
import YouTubeFrame from './services/youtube-frame';


interface EditorOptions {
    tag: string
}

interface MyWindow extends Window {
  MediumEditor: (option: EditorOptions) => Editor
}

declare var window: MyWindow;


document.addEventListener('DOMContentLoaded', () => {
  const theme = new Theme();
  const loadAjaxLinks = new LoadAjaxLinks();
  const mobileSearch = new MobileSearch();
  const youTubeFrame = new YouTubeFrame();
  const select2 = new ClassSelect2();
  const inputPass = new Input();
  const trigers = new JsTabTriggers();
  const openModals = new CoinJS();
  const readMore = new ReadMore();
  const copyLinks = new CopyLinkToClipboard();
  const linkTrimming = new LinkTrimming();
  const timeline = new InitTimeline();
  const tippy = new Tippy();
  const report = new Report();
  const profileSettings = new ProfileSettings();
  const setupPage = new SetupPage();
  const discoverCarousel = new DiscoverCarousel();
  const discoverPagesGrid = new DiscoverPagesGrid();
  const discoveryCommunity = new Community();

  const initFormValidation = () => {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      const validation = () => new FormValidation(form);
      validation();
    });
  };
  initFormValidation();

  select2.init();
  theme.init();
  inputPass.init();
  loadAjaxLinks.init();
  mobileSearch.init();
  youTubeFrame.init();
  initSelects();
  trigers.init();
  openModals.init();
  Sidebar();
  dropdowns();
  mobNav();
  readMore.init();
  copyLinks.init();
  linkTrimming.init();
  tippy.init();
  report.init();
  profileSettings.init();

  timeline.init();
  tippySidebar();

  discoverCarousel.init();
  discoverPagesGrid.init();
  discoveryCommunity.init();

  window.MediumEditor = (options) => {
    return new Editor(options.tag, options);
  };

  const initDropdowns = () => {
    document.addEventListener('click', (e) => {
      const targetItem = e.target;
      let dropdown;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-dropdown')
      ) {
        dropdown = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-dropdown')
      ) {
        dropdown = targetItem.closest('.js-dropdown');
      }

      if (dropdown && targetItem) {
        dropdowns(dropdown, targetItem);
      }
    });
  };
  initDropdowns();

  const initBtnContentChange = () => {
    document.addEventListener('click', (e) => {
      const targetItem = e.target;
      let btn;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-btn-item')
      ) {
        btn = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-btn-item')
      ) {
        btn = targetItem.closest('.js-btn-item');
      }

      if (btn) {
        new BtnContentChange(btn).init();
      }
    });
  };
  initBtnContentChange();

  const initFollowBtnChange = () => {
    document.addEventListener('click', (e) => {
      const targetItem = e.target;
      let btn;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-follow-btn-wrapper')
      ) {
        btn = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-follow-btn-wrapper')
      ) {
        btn = targetItem.closest('.js-follow-btn-wrapper');
      }

      if (btn) {
        new FollowBtnChange(btn).init();
      }
    });
  };
  initFollowBtnChange();

  const initCharLimitsCounter = () => {
    const counters = document.querySelectorAll('.js-counter-wrapper');
    if (counters.length !== 0) {
      counters.forEach((counter) => new CharLimitsCounter(counter).init());
    }
  };
  initCharLimitsCounter();

  const initEmoji = () => {
    document.addEventListener('click', (e) => {
      const targetItem = e.target;
      let emoji;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-emoji-wrapper')
      ) {
        emoji = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-emoji-wrapper')
      ) {
        emoji = targetItem.closest('.js-emoji-wrapper');
      }

      if (emoji && !emoji.classList.contains('is-inited')) {
        new AddEmoji(emoji).init();
        emoji.classList.add('is-inited');
      }
    });
  };
  initEmoji();
});
