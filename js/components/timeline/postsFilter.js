class FilterPosts {
  constructor(filterBlock) {
    this.filterBlock = filterBlock;
    this.activeFilter = filterBlock.querySelector(
      '.js-posts-filter-item.is-active'
    );
    this.allFilterItems = Array.from(
      filterBlock.querySelectorAll('.js-posts-filter-item')
    );
  }

  initFilterClass(item) {
    this.activeFilter.classList.remove('is-active');
    item.classList.add('is-active');
    this.activeFilter = item;
  }

  initFilterAjax(item) {
    this.dataForAjax = item.getAttribute('data-filter');
    // ajax request
  }

  listeners() {
    this.allFilterItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (item.classList.contains('is-active')) return;
        this.initFilterClass(item);
        this.initFilterAjax(item);
      });
    });
  }

  init() {
    try {
      this.listeners();
    } catch (e) {
      // console.log(e);
    }
  }
}

export default FilterPosts;
