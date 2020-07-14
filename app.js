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
  let exchange = new exchanges[0]();
  let markets = await exchange.loadMarkets();

  Object.keys(markets).forEach(async (key) => {
    let trades = await exchange.fetchTrades(key);
    console.log(trades);
  });
}

init();
