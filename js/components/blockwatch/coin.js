import EditorJSReadonly from '@editorjs/editorjs';
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";

import CoinInfoWidget from '../../blocks/widgets/coinInfoWidget';
import PriceChart from '../../blocks/widgets/priceChart';
import EditorJS from "../../services/editor-service";
import VideoPlayer from '../../services/videoPlayer';
import CustomModal from '../custom-modal';
import SetLatestPostsContent from '../latestPostsContent';
import customLinks from './coin/add-link';
import ChooseOwner from './coin/choose-owner';
import CoinSettings from './coin/coin-settings';
import CoinTopSection from './coin/coin-top-section';
import CoinMarkets from './coin/coinMarkets';
import FollowBtn from './coin/components/follow-btn';
import CreateCoin from './coin/create-coin';
import AboutSettings from './coin/settings/about';
import ShareCoin from './coin/shareCoin';
import JsTabTriggers from './coin-type-tab';
import Convert from './widget/convert';

class CoinJS {
  constructor() {
    this.inputCoinId = document.querySelector('.js-coin-id');
    this.blockedWaitlist = document.querySelector('.blocked-waitlist');
    if (this.inputCoinId) {
      this.coinId = this.inputCoinId.value;
    }
    this.coinTypeDelete = new CustomModal('delete-page');
    this.coinChangeName = new CustomModal('change-name');
    this.coinModalTeam = new CustomModal('add-members');
    this.coinModalPartners = new CustomModal('add-partners');
    this.shareCoin = new ShareCoin();
    this.addLinksWrapper = document.querySelector('.js-additional-links');
    this.closeModalBtnDelete = document.querySelector('.js-close-modal-delete');
    this.closeReportModal = document.querySelector('.js-close-modal-report');
    this.closeAddTagModal = document.querySelector('.js-submit-add-tags');
    this.coinTagModal = new CustomModal('add-tags');
    this.waitlist = new CustomModal('join-waitlist-popup');
    this.closeModalBtnMembers = document.querySelector(
      '.js-close-modal-members'
    );
    this.closeModalBtnPartners = document.querySelector(
      '.js-close-modal-partners'
    );
    this.closeModalBtnChangeName = document.querySelector(
      '.js-close-modal-change-name'
    );
    this.closeModalTagDelete = document.querySelector('.js-close-modal-tag');

    this.followersWrapper = document.querySelector(
      '.js-card-content-followers'
    );
    this.adminsWrapper = document.querySelector('.js-card-content-admins');
    this.removeAdmin = document.querySelectorAll('.js-remove-admin');
    this.addAdmin = document.querySelectorAll('.js-add-admin');
    this.removeUser = document.querySelectorAll('.js-remove-user');
    this.seeAllTags = document.querySelector('.js-see-all');
    this.seeTagsWrap = document.querySelector('.b-coin-tags__items');
    this.tagItem = document.querySelectorAll('.b-coin-tags__item');
    this.isAnonymous = true;
    this.isUserLoaded = false;
    this.chooseOwner = new ChooseOwner();
    this.coinInfoWidget = new CoinInfoWidget();
    this.priceChart = new PriceChart();
    this.convert = new Convert();
    this.triggers = new JsTabTriggers();
    this.coinTopSection = new CoinTopSection();
    this.aboutSettings = new AboutSettings();
    this.coinSetting = new CoinSettings();
    this.coinTypeModal = new CustomModal(
      'choose-owner-company',
      'js-open-modal-owner'
    );
    this.reportPage = new CustomModal('report', 'js-report');
    this.followBtn = new FollowBtn();
    this.createCoin = new CustomModal('create-coin-page', 'js-create-coin');
    this.coinConnectModal = new CustomModal(
      'coin-connect',
      'js-open-coin-connect'
    );
    this.coinTagModal = new CustomModal('add-tags', 'js-add-tag');
    this.coinTypeDelete = new CustomModal(
      'delete-page',
      'js-modal-delete-coin'
    );
    this.coinChangeName = new CustomModal(
      'change-name',
      'js-open-modal-change-name'
    );
    this.coinModalTeam = new CustomModal(
      'add-members',
      'js-open-modal-team-members'
    );
    this.coinModalPartners = new CustomModal(
      'add-partners',
      'js-open-modal-partners'
    );
    this.createCoin = new CreateCoin();
    this.coinModalCreatePage = new CustomModal(
      'create-coin-page',
      'js-open-modal-create-coin'
    );
    if(this.coinId){
      this.initLatestPostsContent = new SetLatestPostsContent(
        `${window.location.origin}/v2/api/coins/${this.coinId}/posts?page=1&amount=3`
      );
    }
    this.coinMarketsTable = new CoinMarkets();
    this.videoItems = document.querySelectorAll('.js-video');
    this.videoLoadedItem = document.querySelector('.js-coin-loaded-video');
    this.videoYoutubeItem = document.querySelector('.js-coin-youtube-video');
    this.videoHiddenInput = document.querySelector('.js-video-input');
    this.aboutTextReadonly = document.querySelector('.js-about-text-readonly');
  }

  initShareCoinPopups = () => {
    const shareToTimelineBtn = document.querySelector(
      '.js-share-coin-to-timeline-btn'
    );

    const shareToSocialsBtn = document.querySelector(
      '.js-share-coin-to-socials-btn'
    );

    if (shareToTimelineBtn) {
      const shareToTimelinePopup = new CustomModal('share-coin-to-timeline');
      const sharePopup = document.querySelector(
        '.js-share-coin-to-timeline-popup'
      );
      const cancelBtns = sharePopup.querySelectorAll(
        '.js-cancel-share-coin-btn'
      );

      shareToTimelineBtn.addEventListener('click', () => {
        shareToTimelinePopup.open();
      });

      cancelBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          shareToTimelinePopup.close();
        });
      });

      shareToTimelinePopup.init();
    }

    if (shareToSocialsBtn) {
      const shareToSocialsPopup = new CustomModal('share-coin-to-socials');

      shareToSocialsBtn.addEventListener('click', () => {
        shareToSocialsPopup.open();
      });

      shareToSocialsPopup.init();
    }

    this.shareCoin.init();
  };

  insertVideo() {
    if (this.videoHiddenInput.value.indexOf('youtu') !== -1) {
      this.videoLoadedItem.remove();
      new VideoPlayer(this.videoYoutubeItem).init();
      this.videoYoutubeItem.classList.remove('hidden');
    }

    if (this.videoHiddenInput.value.indexOf('youtu') === -1) {
      this.videoYoutubeItem.remove();
      new VideoPlayer(this.videoLoadedItem).init();
      this.videoLoadedItem.classList.remove('hidden');
    }
  }

  listeners() {
    const self = this;
    if (this.videoHiddenInput) {
      this.insertVideo();
    }
    if (this.closeModalBtnDelete) {
      this.closeModalBtnDelete.addEventListener('click', () => {
        this.coinTypeDelete.close();
      });
    }
    if (this.closeAddTagModal) {
      this.closeAddTagModal.addEventListener('click', () => {
        this.coinTagModal.close();
      });
    }
    if (this.closeModalBtnChangeName) {
      this.closeModalBtnChangeName.addEventListener('click', () => {
        this.coinChangeName.close();
      });
    }
    if (this.closeReportModal) {
      this.closeReportModal.addEventListener('click', () => {
        this.reportPage.close();
      });
    }
    if (this.closeModalTagDelete) {
      this.closeModalTagDelete.addEventListener('click', () => {
        this.coinTagModal.close();
      });
    }
    if (this.closeModalBtnMembers) {
      this.closeModalBtnMembers.addEventListener('click', () => {
        this.coinModalTeam.close();
      });
    }
    if (this.closeModalBtnPartners) {
      this.closeModalBtnPartners.addEventListener('click', () => {
        this.coinModalPartners.close();
      });
    }
    if (this.removeAdmin.length > 0) {
      this.removeAdmin.forEach((btn) => {
        btn.addEventListener('click', () => {
          const cardFollower = btn.closest('.js-user-item');
          self.followersWrapper.append(cardFollower);
        });
      });
    }
    if (this.addAdmin.length > 0) {
      this.addAdmin.forEach((btn) => {
        btn.addEventListener('click', () => {
          const cardAdmin = btn.closest('.js-user-item');
          self.adminsWrapper.append(cardAdmin);
        });
      });
    }
    if (this.removeUser.length > 0) {
      this.removeUser.forEach((btn) => {
        btn.addEventListener('click', () => {
          btn.closest('.js-user-item').remove();
        });
      });
    }
    if (this.seeAllTags) {
      if (this.seeTagsWrap.scrollHeight > 36) {
        this.seeAllTags.addEventListener('click', (e) => {
          e.preventDefault();
          this.seeTagsWrap.classList.toggle('is-active');
          if (this.seeTagsWrap.classList.contains('is-active')) {
            this.seeAllTags.textContent = 'Show less';
          } else {
            this.seeAllTags.textContent = 'Show more';
          }
        });
      } else {
        this.seeAllTags.remove();
      }
    }

    const tagRemoveBtns = document.querySelectorAll('.js-tag-close');
    if (tagRemoveBtns.length > 0) {
      tagRemoveBtns.forEach((item) => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          item.closest('.b-coin-tags__item').remove();
        });
      });
    }
  }

  init() {
    fetch(`/v2/api/users/me`, {
      method: 'GET',
    })
      .then((response) => {
        this.isAnonymous = response.status === 401;
      })
      .catch(() => {
        this.isAnonymous = true;
      })
      .then(() => {
        this.isUserLoaded = true;
        this.fireClickWaitlist();
      });

    if (window.location.href.indexOf('settings/about') !== -1) {
      this.aboutSettings.init();
    }

    this.listeners();

    if (this.addLinksWrapper) {
      customLinks();
    }
    if (this.coinInfoWidget) {
      this.coinInfoWidget.init();
    }
    if (this.priceChart) {
      this.priceChart.init();
    }
    if (this.convert) {
      this.convert.init();
    }
    if (this.triggers) {
      this.triggers.init();
    }
    if (this.coinTopSection) {
      this.coinTopSection.init();
    }
    if (this.coinTypeModal) {
      this.coinTypeModal.init();
    }
    if (this.coinTypeDelete) {
      this.coinTypeDelete.init();
    }
    if (this.coinChangeName) {
      this.coinChangeName.init();
    }
    if (this.reportPage) {
      this.reportPage.init();
    }
    if (this.createCoin) {
      this.createCoin.init();
    }
    this.chooseOwner.init();
    this.coinSetting.init();
    if (this.coinModalTeam) {
      this.coinModalTeam.init();
    }
    if (this.coinModalPartners) {
      this.coinModalPartners.init();
    }
    if (this.coinModalCreatePage) {
      this.coinModalCreatePage.init();
    }
    this.initShareCoinPopups();
    if(this.coinId){
      this.initLatestPostsContent.init();
    }
    this.coinMarketsTable.init();
    this.followBtn.init();

    if(this.aboutTextReadonly) {
      const data = this.aboutTextReadonly.getAttribute('data-content');
      let data1 = {};

      if (data) {
        data1 = JSON.parse(data);
      }

      const editor = new EditorJSReadonly({
        data: data1,
        holder: 'js-about-text-readonly',
        readOnly: true,
        tools: {
          header: {
            class: Header,
            levels: [1, 2, 4],
            defaultLevel: 1,
            inlineToolbar: ['bold', 'italic', 'link'],
          },
          paragraph: {
            class: Paragraph,
            levels: 1,
            inlineToolbar: ['bold', 'italic', 'link']
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
                facebook: true,
              }
            }
          },
        }
      });
    }
  }


  fireClickWaitlist() {
    if (
      this.blockedWaitlist &&
      this.isAnonymous === true &&
      this.isUserLoaded === true
    ) {
      document.addEventListener('click', (e) => {
        if (
          e.target.closest('.blocked-waitlist') ||
          e.target.classList.contains('blocked-waitlist')
        ) {
          e.preventDefault();
          this.waitlist.open();
        }
      });
    }
  }
}

export default CoinJS;
