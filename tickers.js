"use strict";

//script for fetchign and exportin ticker stats
//test comment
const fs = require("fs");
const dotenv = require("dotenv").config();
const ccxt = require("ccxt");
const exchangeClasses = [];
const exchanges = [];
const prefExchanges = ["binance", "bitfinex", "bitflyer", "bithumb", "bitmart", "bitmax", "bitmex", "bitstamp", "bittrex", "coinbase", "coinbasepro", "coincheck", "deribit", "ftx", "gateio", "huobipro", "indodax", "itbit", "kraken", "kucoin", "liquid", "okex", "poloniex", "upbit"];
const bitmax = new ccxt.bitmax();
const TRADE_COUNT = process.env.TRADE_COUNT;
const _ = require("lodash");
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



//fetching and exporting trades to json files /exports
async function loadTickers() {
    for (let i = 0; i < exchanges.length; i++) {
        try {
            let exchange = new exchanges[i]({ 'enableRateLimit': true });
            let markets = await exchange.loadMarkets();
        

            if (exchange.hasFetchTickers) {
                let tickers = await exchange.fetchTickers();  //we can not limit to a certain amount of trades as it breaks pagination on some exchanges
                
                Object.keys(tickers).forEach(ticker =>{
                    let temp = tickers[ticker]
                    let output = {
                        exchange: exchange.id,
                        temp
                      };
                    
                    let str =tickers[ticker].symbol;                   
                    let symbolName = str.replace(/[\/\\]/g,'');                 //some tickers are formated differently so I extract all the special chars to avoid errors on the file system
                    let fileName = exchange.id + "-" + symbolName + "-ticker.json";
                    let data = JSON.stringify(output, null, 4);
    
                    //fs.writeFileSync("exports/tickers/" + fileName, data);
                })
                
             
            } else {
                console.log(exchange.id + " does not support fetching tickers");
            }

        } catch (err) {
            console.log(err);
        }
    }
}
//application start function
function run() {
    initExchanges();
    loadTickers();
}

//app entry point
run();
