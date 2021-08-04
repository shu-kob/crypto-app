let bitcoin = require('bitcoinjs-lib');

const keyPair = bitcoin.ECPair.makeRandom();

const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

console.log(address);