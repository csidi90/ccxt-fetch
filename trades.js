"use strict";

const fs = require("fs");
const dotenv = require("dotenv").config();
const ccxt = require("ccxt");
const exchangeClasses = [];
const exchanges = [];
const prefExchanges = ["binance", "bitfinex", "bitflyer", "bithumb", "bitmart", "bitmax", "bitmex", "bitstamp", "bittrex", "coinbase", "coinbasepro", "coincheck", "deribit", "ftx", "gateio", "huobipro", "indodax", "itbit", "kraken", "kucoin", "liquid", "okex", "poloniex", "upbit"];
const bitmax = new ccxt.bitmax();


function initExchanges() {
  let exchangeIDs = ccxt.exchanges;
  //get exchange classes
  Object.keys(exchangeIDs).forEach((key) => {
    if (prefExchanges.includes(exchangeIDs[key])) {
      exchangeClasses.push(ccxt[exchangeIDs[key]]);
    }
  });
  //store instances of exchanges
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
      let exchange = new exchanges[i]({'enableRateLimit': true});
     
      let markets = await exchange.loadMarkets();
      let symbols = exchange.symbols;
  
      Object.keys(symbols).forEach(async (key) => {
        
        if (exchange.hasFetchTrades) {
          let trades = await exchange.fetchTrades(symbols[key]);
          
          let output = {
            exchange: exchange.id,
            symbol: key,
            trades: trades,
          };

        

          let fileName = exchange.id + "-" + markets[symbols[key]].base + markets[symbols[key]].quote + "-trades.json";
          let data = JSON.stringify(output, null, 4);

          fs.writeFileSync("exports/" + fileName, data);
        } else {
          console.log(exchange.id + " does not support fetching trades");
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
}

init();
