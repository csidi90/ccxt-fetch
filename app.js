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
  let exchange = new exchanges[0]();
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
}

init();
