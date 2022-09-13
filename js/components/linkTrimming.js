class LinkTrimming {
  constructor() {
    this.websiteLinks = Array.from(
      document.querySelectorAll('.js-website-link')
    );
  }

  trimWebsiteLink = (link) => {
    const websiteLink = link;
    let fullLink = null;

    if (link.getAttribute('href') !== null) {
      fullLink = link.getAttribute('href');
    } else if (link.getAttribute('data-link') !== null) {
      fullLink = link.getAttribute('data-link');
    }

    if (fullLink.indexOf('http') !== -1) {
      const url = new URL(fullLink);
      const trimmedLink = url.hostname;
      websiteLink.textContent = trimmedLink;
    }
  };

  init() {
    this.websiteLinks.forEach((link) => {
      this.trimWebsiteLink(link);
    });
  }
}

export default LinkTrimming;
