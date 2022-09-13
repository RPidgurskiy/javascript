import { throttle } from 'throttle-debounce';

class CoinMarkets {
  constructor() {
    this.coinMarketsTable = document.querySelector('.js-coin-market-table');
    if (this.coinMarketsTable) {
      this.coinMarketRow = this.coinMarketsTable.querySelector(
        '.js-coin-market-row.hidden'
      );
    }
    if (document.querySelector('.js-coin-ticker')) {
      this.coinTicker = document.querySelector('.js-coin-ticker').value;
    }
    this.locationOrigin = window.location.origin;
    this.marketOrder = 1;
    this.isLoaded = false;
    this.pageNumber = 1;
    this.totalCountOfPages = null;
  }

  setDataOfCoinMarkets() {
    fetch(
      `${this.locationOrigin}/v2/api/coins/${this.coinTicker}/markets?page=${this.pageNumber}&amount=10`
    )
      .then((response) => response.json())
      .then((data) => {
        const marketOrder = this.coinMarketRow.querySelector(
          '.js-coin-market-order'
        );
        const marketLogo = this.coinMarketRow.querySelector(
          '.js-coin-market-image'
        );
        const marketPair = this.coinMarketRow.querySelector(
          '.js-coin-market-pair'
        );
        const marketName = this.coinMarketRow.querySelector(
          '.js-coin-market-name'
        );
        const marketPrice = this.coinMarketRow.querySelector(
          '.js-coin-market-price'
        );
        const marketVolume = this.coinMarketRow.querySelector(
          '.js-coin-market-volume'
        );
        const marketLiquidity = this.coinMarketRow.querySelector(
          '.js-coin-market-liquidity'
        );
        const marketFeesMin = this.coinMarketRow.querySelector(
          '.js-coin-market-fees-min'
        );
        const marketFeesMax = this.coinMarketRow.querySelector(
          '.js-coin-market-fees-max'
        );
        if (!data.total) {
          document.querySelector('.coin-market').classList.remove('hidden');
          document.querySelector('.b-coin-table').classList.add('hidden');
        }
        data.data.forEach((market) => {
          const marketPriceData = Number(
            market.price.toFixed(2)
          ).toLocaleString('en-US');
          const marketLogoData = market.parent_exchange.logo;
          const marketNameData = market.parent_exchange.name;
          const marketVolumeData = parseInt(
            market.volume_24h,
            10
          ).toLocaleString('en-US');
          const marketLiquidityData = parseInt(
            market.positive_2_percent,
            10
          ).toLocaleString('en-US');
          const marketFeesMinData = market.parent_exchange.maker_fee;
          const marketFeesMaxData = market.parent_exchange.taker_fee;
          const marketPairData = market.base_coin.symbol + '/' + market.quote_coin.symbol;

          marketOrder.textContent = this.marketOrder;
          this.marketOrder += 1;

          marketLogo.setAttribute('src', marketLogoData);

          marketName.textContent = marketNameData;

          marketPrice.textContent = `$${marketPriceData}`;

          marketVolume.textContent = `$${marketVolumeData}`;

          marketLiquidity.textContent = marketLiquidityData;
          marketPair.textContent = marketPairData;

          if (marketFeesMinData === '') {
            marketFeesMin.textContent = '--';
          } else {
            marketFeesMin.textContent = `${marketFeesMinData}%`;
          }

          if (marketFeesMaxData === '') {
            marketFeesMax.textContent = '--';
          } else {
            marketFeesMax.textContent = `${marketFeesMaxData}%`;
          }

          const newMarketRow = this.coinMarketRow.cloneNode(true);
          this.coinMarketsTable.append(newMarketRow);
          newMarketRow.classList.remove('hidden');
        });

        this.isLoaded = false;
        this.totalCountOfPages = data.last_page;
      })
      // eslint-disable-next-line no-console
      .catch((response) => console.log(response));
  }

  insertMarkets() {
    if (
      !this.isLoaded &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      this.isLoaded = true;
      this.pageNumber += 1;
      if (this.pageNumber <= this.totalCountOfPages) {
        this.setDataOfCoinMarkets();
      } else {
        this.isLoaded = true;
      }
    }
  }

  listeners() {
    window.addEventListener('scroll', () => {
      const throttleFunc = throttle(1000, false, () => {
        this.insertMarkets();
      });

      throttleFunc();
    });
  }

  init() {
    if (this.coinMarketsTable) {
      this.setDataOfCoinMarkets();
      this.listeners();
    }
  }
}

export default CoinMarkets;
