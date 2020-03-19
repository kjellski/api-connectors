'use strict';
const _ = require('lodash');
const BitMEXClient = require('./index');

// See 'options' reference below
const client = new BitMEXClient({ testnet: false });

// handle errors here. If no 'error' callback is attached. errors will crash the client.
client.on('error', console.error);
client.on('open', () => console.log('Connection opened.'));
client.on('close', () => console.log('Connection closed.'));
client.on('initialize', () => console.log('Client initialized, data is flowing.'));

const threshold = process.env.THRESHOLD || 5000;

const Sides = Object.freeze({
  Sell: 'Sell',
  Buy: 'Buy'
});

client.addStream('XBTUSD', 'trade', function(data, symbol, tableName) {
  const filtered = data.filter(({ size }) => size > threshold);
  const sells = filtered.filter(({ side }) => side === Sides.Sell);
  const buys = filtered.filter(({ side }) => side === Sides.Buy);

  const percent = Math.floor((filtered.length / data.length) * 100 * 100) / 100;
  // console.log(
  //   `${tableName}:${symbol}: ${filtered.length}(>${threshold})/${data.length} | ${percent} % | Sell: ${sells.length} | Buy: ${buys.length}`
  // );
  console.table([
    {
      count: data.length,
      over_threshold: filtered.length,
      percent,
      sells: sells.length,
      buys: buys.length
    }
  ]);
});
