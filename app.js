const fs = require("fs");
const ccxt = require("ccxt");
const exchangeClasses = [];
const exchanges = [];

function initExchanges() {
  let exchangeIDs = ccxt.exchanges;
  Object.keys(exchangeIDs).forEach((key) => {
    exchangeClasses.push(ccxt[exchangeIDs[key]]);
  });

  Object.keys(exchangeClasses).forEach((key) => {
    exchanges.push(exchangeClasses[key]);
  });
}

function init() {
  initExchanges();
  loadTrades();
}

async function loadTrades() {
  for (let i = 0; i < exchanges.length; i++) {
    try {
      let exchange = new exchanges[i]();
      exchange.rateLimit = true;
      let markets = await exchange.loadMarkets();

      Object.keys(markets).forEach(async (key) => {
        let trades = await exchange.fetchTrades(key);
        let output = {
          exchange: exchange.id,
          symbol: key,
          trades: trades,
        };
        let fileName = exchange.id + "-" + markets[key].id + "-trades.json";
        let data = JSON.stringify(output, null, 4);

        fs.writeFileSync("exports/" + fileName, data);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

init();
