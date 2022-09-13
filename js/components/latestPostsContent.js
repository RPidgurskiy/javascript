import LatestPostsCardStyle from './latestPostsCardStyle';

class SetLatestPostsContent {
  constructor(fetchUrl) {
    this.fetchUrl = fetchUrl;
    this.latestNewsWrapper = document.querySelector('.js-latest-posts-wrapper');
    this.latestNewsBlock = document.querySelector('.js-latest-posts-block');
    this.emptyState = document.querySelector('.js-empty-latest-posts');
    this.hiddenNewsCard = document.querySelector('.js-news-card.hidden');
    this.locationOrigin = window.location.origin;
    this.inputCoinId = document.querySelector('.js-coin-id');
    this.inputCoinName = document.querySelector('.js-coin-name');
    if (this.inputCoinId) {
      this.coinId = this.inputCoinId.value;
    }
    if (this.inputCoinName) {
      this.coinName = this.inputCoinName.value;
    }
  }

  timeDifference = (current, previous) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const difference = current - previous;

    if (difference < msPerMinute) {
      return `${Math.round(difference / 1000)} seconds ago`;
    }
    if (difference < msPerHour) {
      return `${Math.round(difference / msPerMinute)} minutes ago`;
    }
    if (difference < msPerDay) {
      return `${Math.round(difference / msPerHour)} hours ago`;
    }
    if (difference < msPerMonth) {
      return `${Math.round(difference / msPerDay)} days ago`;
    }
    if (difference < msPerYear) {
      return `${Math.round(difference / msPerMonth)} months ago`;
    }
    return `${Math.round(difference / msPerYear)} years ago`;
  };

  setPostContent(postData, postItem) {
    const avatarOfAuthor = postData.owner.avatar;
    const verifiedOfAuthor = postData.owner.verified;
    const nameOfAuthor = postData.owner.name;
    const timeOfPost = postData.time;
    const postText = postData.text;
    const postMediaArray = postData.post_media;
    const postFetchedLink = postData.post_fetched_link;
    const sharedArticle = postData.shared_article;

    const authorAvatarBlock = postItem.querySelector('.js-post-author-avatar');
    if (authorAvatarBlock) {
      authorAvatarBlock.setAttribute('src', avatarOfAuthor);
    }

    const authorNameBlock = postItem.querySelector('.js-post-author-name');
    authorNameBlock.textContent = nameOfAuthor;

    const authorVerifiedBlock = postItem.querySelector('.js-post-verified');
    if (verifiedOfAuthor === true) {
      authorVerifiedBlock.classList.remove('hidden');
    }

    const postTimeBlock = postItem.querySelector('.js-post-time');
    const currentTime = Date.now();
    const postTime = timeOfPost * 1000;
    const timeFromPostPublishing = this.timeDifference(currentTime, postTime);
    postTimeBlock.textContent = timeFromPostPublishing;

    const postTextBlock = postItem.querySelector('.js-news-card-text');
    if (postText !== '') {
      postTextBlock.innerHTML = postText;
      postTextBlock.innerHTML = postText.replace('<br/>', '\n');
      postTextBlock.classList.remove('hidden');

      if (postText.indexOf('[a]') !== -1) {
        const regex =
          // eslint-disable-next-line no-useless-escape
          /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        const matchList = postText.match(regex);

        matchList.forEach((link) => {
          const textOfPost = postTextBlock.innerHTML;
          postTextBlock.innerHTML = textOfPost.replace(
            `[a]${link}[/a]`,
            `<span class="c-link">${decodeURIComponent(link)}</span>`
          );
        });
      }

      if (postText.indexOf('#') !== -1) {
        const regex = /#[\S]{0,}/g;
        const matchList = postText.match(regex);

        matchList.forEach((tag) => {
          const textOfPost = postTextBlock.innerHTML;
          postTextBlock.innerHTML = textOfPost.replace(
            tag,
            `<span class="c-link">${tag}</span>`
          );
        });
      }
    }

    if (postMediaArray !== null) {
      const singleMediaBlock = postItem.querySelector(
        '.js-news-card-media-single'
      );
      const multipleMediaBlock = postItem.querySelector(
        '.js-news-card-media-multiple'
      );

      if (postMediaArray.length === 1) {
        const postImage = singleMediaBlock.querySelector('.js-post-image');
        const postVideo = singleMediaBlock.querySelector('.js-post-video');

        if (postMediaArray[0].type === 'image') {
          postImage.classList.remove('hidden');
          postImage
            .querySelector('img')
            .setAttribute('src', postMediaArray[0].url);
        } else if (postMediaArray[0].type === 'video') {
          postVideo.classList.remove('hidden');
          postVideo
            .querySelector('source')
            .setAttribute('src', postMediaArray[0].url);
        }

        singleMediaBlock.classList.remove('hidden');
      }

      if (postMediaArray.length > 1) {
        const mediaInnerLeft = multipleMediaBlock.querySelector(
          '.js-post-media-inner-left'
        );
        const mediaInnerRight = multipleMediaBlock.querySelector(
          '.js-post-media-inner-right'
        );

        postMediaArray.forEach((media, index) => {
          if (index === 0) {
            const postImage = mediaInnerLeft.querySelector('.js-post-image');
            const postVideo = mediaInnerLeft.querySelector('.js-post-video');

            if (media.type === 'image') {
              postImage.classList.remove('hidden');
              postImage.querySelector('img').setAttribute('src', media.url);
            } else if (media.type === 'video') {
              postVideo.classList.remove('hidden');
              postVideo.querySelector('source').setAttribute('src', media.url);
            }
          }

          if (index > 0 && index < 4) {
            const postImage = mediaInnerRight.querySelector('.js-post-image');
            const postVideo = mediaInnerRight.querySelector('.js-post-video');

            if (media.type === 'image') {
              const newImage = postImage.cloneNode(true);
              mediaInnerRight.appendChild(newImage);
              newImage.querySelector('img').setAttribute('src', media.url);
              if (index === 3 && postMediaArray.length > 4) {
                const mediaCount = newImage.querySelector(
                  '.js-post-media-count'
                );
                mediaCount.classList.remove('hidden');
                mediaCount.textContent = `+${postMediaArray.length - 4}`;
              }
              if (postMediaArray.length === 2) {
                newImage.classList.add('c-post__image--two');
              } else if (postMediaArray.length === 3) {
                newImage.classList.add('c-post__image--three');
              } else if (postMediaArray.length >= 4) {
                newImage.classList.add('c-post__image--four');
              }
              newImage.classList.remove('hidden');
            } else if (media.type === 'video') {
              const newVideo = postVideo.cloneNode(true);
              mediaInnerRight.appendChild(newVideo);
              newVideo.querySelector('source').setAttribute('src', media.url);
              if (index === 3 && postMediaArray.length > 4) {
                const mediaCount = newVideo.querySelector(
                  '.js-post-media-count'
                );
                mediaCount.classList.remove('hidden');
                mediaCount.textContent = `+${postMediaArray.length - 4}`;
              }
              if (postMediaArray.length === 2) {
                newVideo.classList.add('c-post__image--two');
              } else if (postMediaArray.length === 3) {
                newVideo.classList.add('c-post__image--three');
              } else if (postMediaArray.length >= 4) {
                newVideo.classList.add('c-post__image--four');
              }
              newVideo.classList.remove('hidden');
            }
          }
        });

        if (postMediaArray.length === 2) {
          multipleMediaBlock.classList.add('c-post__image-wrapper--two');
        } else if (postMediaArray.length === 3) {
          multipleMediaBlock.classList.add('c-post__image-wrapper--three');
          mediaInnerLeft.classList.add('c-post__image-inner--width');
        } else if (postMediaArray.length >= 4) {
          multipleMediaBlock.classList.add('c-post__image-wrapper--four');
          mediaInnerLeft.classList.add('c-post__image-inner--width');
        }

        multipleMediaBlock.classList.remove('hidden');
      }
    }

    if (postFetchedLink !== null) {
      const fetchedLinkBlock = postItem.querySelector(
        '.js-post-fetched-link-block'
      );
      const fetchedPhoto = fetchedLinkBlock.querySelector(
        '.js-fetched-link-with-photo'
      );
      const fetchedVideo = fetchedLinkBlock.querySelector(
        '.js-fetched-link-with-video'
      );

      if (postFetchedLink.post_link_image !== null) {
        const image = fetchedPhoto.querySelector('img');
        const url = fetchedPhoto.querySelector('.js-fetched-url');
        const title = fetchedPhoto.querySelector('.js-fetched-title');

        image.setAttribute('src', postFetchedLink.post_link_image);
        image.setAttribute('alt', postFetchedLink.post_link_title);
        url.textContent = postFetchedLink.link;
        title.textContent = postFetchedLink.post_link_title;
        fetchedPhoto.classList.remove('hidden');
        fetchedLinkBlock.classList.remove('hidden');
      }

      if (postFetchedLink.post_link_video !== null) {
        const video = fetchedVideo.querySelector('source');
        video.setAttribute('src', postFetchedLink.post_link_video);
        fetchedVideo.classList.remove('hidden');
      }
    }

    if (sharedArticle !== null) {
      const sharedArticleBlock = postItem.querySelector('.js-shared-article');
      const articleImage = sharedArticleBlock.querySelector(
        '.js-shared-article-image img'
      );
      const articleTitle = sharedArticleBlock.querySelector(
        '.js-shared-article-title'
      );
      const articleDesc = sharedArticleBlock.querySelector(
        '.js-shared-article-description'
      );

      articleImage.setAttribute('src', sharedArticle.image);
      articleImage.setAttribute('alt', sharedArticle.title);
      articleTitle.textContent = sharedArticle.title;
      articleDesc.textContent = sharedArticle.description;

      sharedArticleBlock.classList.remove('hidden');
    }
  }

  setLatestPosts() {
    return fetch(this.fetchUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          if (data.data.length === 0) {
            this.emptyState.classList.remove('hidden');
          } else {
            this.latestNewsBlock.classList.remove('hidden');
          }

          data.data.forEach((post) => {
            const idOfPost = post.id;
            const likes = post.like_counter;
            const commentsAndReplies = post.comments_and_replies;
            const sharesCount = post.shares;
            const sharedPost = post.shared_post;

            const newsCard = this.hiddenNewsCard.cloneNode(true);
            this.latestNewsBlock.appendChild(newsCard);

            newsCard.setAttribute(
              'href',
              `${window.location.origin}/${this.coinName}`
            );

            const postBody = newsCard.querySelector('.js-post-body');
            postBody.setAttribute('id', idOfPost);

            this.setPostContent(post, newsCard);

            if (sharedPost !== null) {
              const sharedPostBlock = newsCard.querySelector(
                '.js-news-card-shared-post'
              );
              const postData = post.shared_post;
              this.setPostContent(postData, sharedPostBlock);
              sharedPostBlock.classList.remove('hidden');
            }

            const likesBlock = newsCard.querySelector('.js-post-likes-block');
            const likesAmountBlock = newsCard.querySelector(
              '.js-post-likes-amount'
            );
            if (likes > 0) {
              likesAmountBlock.textContent = likes;
            } else {
              likesBlock.classList.add('hidden');
            }

            const commentsBlock = newsCard.querySelector('.js-comments-block');
            const commentsAmountBlock = newsCard.querySelector(
              '.js-comments-amount'
            );
            if (commentsAndReplies > 0) {
              commentsAmountBlock.textContent = commentsAndReplies;
            } else {
              commentsBlock.classList.add('hidden');
            }

            const sharesBlock = newsCard.querySelector('.js-shares-block');
            const sharesAmountBlock =
              newsCard.querySelector('.js-shares-amount');
            if (sharesCount > 0) {
              sharesAmountBlock.textContent = sharesCount;
            } else {
              sharesBlock.classList.add('hidden');
            }

            newsCard.classList.remove('hidden');
          });

          const cards = document.querySelectorAll('.js-news-card');
          cards.forEach((card) => new LatestPostsCardStyle(card).init());
        }
      });
  }

  init() {
    if (this.latestNewsWrapper) {
      return this.setLatestPosts();
    } else {
      return '';
    }
  }
}

export default SetLatestPostsContent;
