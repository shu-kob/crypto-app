let bitcoin = require('bitcoinjs-lib');

const keyPair = bitcoin.ECPair.makeRandom();

console.log("private key WIF:\n" + keyPair.toWIF());

const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });

console.log("random address:\n" + address);