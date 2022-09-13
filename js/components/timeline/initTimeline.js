import AddMention from './addMention';
import CommentCreation from './commentCreation';
import CommentDelete from './commentDelete';
import CommentEditing from './commentEditing';
import CommentLikeUnlike from './commentLikeUnlike';
import CommentMoreLoading from './commentMoreLoading';
import CommentRepliesToggle from './commentRepliesToggle';
import CommentReplyCreation from './commentReplyCreation';
import DeleteBanner from './deleteBanner';
import initPopups from './initPopups';
import PostActions from './postActions';
import PostCreation from './postCreation';
import FilterPosts from './postsFilter';
import PostSharing from './postSharing';

class InitTimeline {
  constructor() {
    this.timelineContent = document.querySelector('.js-timeline-content');
    this.sharePopup = document.querySelector('.c-share-to-timeline');
  }

  initPostsFilters = () => {
    const filters = document.querySelectorAll('.js-posts-filter');
    if (filters.length !== 0) {
      filters.forEach((filter) => new FilterPosts(filter).init());
    }
  };

  initPostsCreation = () => {
    const createPostBlocks = document.querySelectorAll(
      '.js-post-creation-block'
    );
    if (createPostBlocks.length !== 0) {
      createPostBlocks.forEach((postBlock) =>
        new PostCreation(postBlock).init()
      );
    }
  };

  initPostActions = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;
      let postWrapper;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-single-post-wrapper')
      ) {
        postWrapper = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-single-post-wrapper')
      ) {
        postWrapper = targetItem.closest('.js-single-post-wrapper');
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-media-preview-modal')
      ) {
        postWrapper = targetItem.closest('.js-media-preview-modal');
      }

      if (postWrapper) {
        new PostActions(postWrapper).init(e);
      }
    });
  };

  initPostSharing = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;
      let post;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-post')
      ) {
        post = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-post')
      ) {
        post = targetItem.closest('.js-post');
      }

      if (post && !post.classList.contains('is-inited')) {
        new PostSharing(post).init();
        post.classList.add('is-inited');
      }
    });
  };

  initCommentLikeUnlike = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;
      let comment;

      if (
        targetItem instanceof Element &&
        (targetItem.classList.contains('js-like-comment-btn') ||
          targetItem.closest('.js-like-comment-btn'))
      ) {
        comment = targetItem.closest('.js-comment');
      }

      if (comment) {
        new CommentLikeUnlike(comment).init();
      }
    });
  };

  initCommentRepliesToggle = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;
      let comment;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-comment-replies')
      ) {
        comment = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-comment-replies')
      ) {
        comment = targetItem.closest('.js-comment-replies');
      }

      if (comment) {
        new CommentRepliesToggle(comment).init(e);
      }
    });
  };

  initCommentCreation = () => {
    this.timelineContent.addEventListener('focusin', (e) => {
      const targetItem = e.target;
      let commentCreationBlock;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-comment-textarea')
      ) {
        commentCreationBlock = targetItem.closest('.js-write-comment-block');
        new CommentCreation(commentCreationBlock).init();
      }
    });
  };

  initCommentEditing = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;

      if (
        targetItem instanceof Element &&
        (targetItem.classList.contains('js-edit-comment-btn') ||
          targetItem.closest('.js-edit-comment-btn'))
      ) {
        const commentBlock = targetItem.closest('.js-comment-block');
        const replyBlock = targetItem.closest('.js-comment-reply');

        if (replyBlock) {
          new CommentEditing(replyBlock).init(e);
        } else if (commentBlock) {
          new CommentEditing(commentBlock).init(e);
        }
      }
    });
  };

  initCommentReplyCreation = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;
      let commentBlock;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-comment-block')
      ) {
        commentBlock = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-comment-block')
      ) {
        commentBlock = targetItem.closest('.js-comment-block');
      }

      if (commentBlock) {
        new CommentReplyCreation(commentBlock).init(e);
      }
    });
  };

  initCommentMoreLoading = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;
      let commentBlock;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-comments-block')
      ) {
        commentBlock = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-comments-block')
      ) {
        commentBlock = targetItem.closest('.js-comments-block');
      }

      if (commentBlock) {
        new CommentMoreLoading(commentBlock).init(e);
      }
    });
  };

  initCommentDelete = () => {
    this.timelineContent.addEventListener('click', (e) => {
      const targetItem = e.target;
      let comment;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-comment')
      ) {
        comment = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-comment')
      ) {
        comment = targetItem.closest('.js-comment');
      }

      if (comment) {
        new CommentDelete(comment).init(e);
      }
    });
  };

  initMention = () => {
    const setMention = (e) => {
      const targetItem = e.target;
      let mentionWrapper;

      if (
        targetItem instanceof Element &&
        targetItem.classList.contains('js-mention-wrapper')
      ) {
        mentionWrapper = targetItem;
      } else if (
        targetItem instanceof Element &&
        targetItem.closest('.js-mention-wrapper')
      ) {
        mentionWrapper = targetItem.closest('.js-mention-wrapper');
      }

      if (mentionWrapper) {
        new AddMention(mentionWrapper).init();
      }
    };

    if (this.timelineConten) {
      this.timelineContent.addEventListener('click', (e) => {
        setMention(e);
      });
    }

    if (this.sharePopup) {
      this.sharePopup.addEventListener('click', (e) => {
        setMention(e);
      });
    }
  };

  initDeleteBanners = () => {
    const banners = document.querySelectorAll('.js-banner');
    if (banners.length !== 0) {
      banners.forEach((banner) => new DeleteBanner(banner).init());
    }
  };

  init() {
    if (this.timelineContent) {
      this.initPostsFilters();
      this.initPostsCreation();
      this.initPostActions();
      this.initPostSharing();
      this.initCommentLikeUnlike();
      this.initCommentRepliesToggle();
      this.initCommentCreation();
      this.initCommentEditing();
      this.initCommentReplyCreation();
      this.initCommentMoreLoading();
      this.initCommentDelete();
      this.initMention();
      this.initDeleteBanners();
      initPopups();
    }

    if (this.sharePopup) {
      this.initMention();
    }
  }
}

export default InitTimeline;
