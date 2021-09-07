const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const wif = require('wif');
const { xpub } = require('./xpub.json');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const { xpriv } = require('./xpriv.json');

function getPrivKey(xpriv, addressIndex){
    const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
    const privateKey_wif = privkeyNode.derive(0).derive(addressIndex).toWIF();
    return privateKey_wif;
}

const privateKey_wif = getPrivKey(xpriv, 0);

console.log("privateKey_wif:");
console.log(privateKey_wif);

function getPubkeyFromXpub(xpub, addressIndex) {
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(0).derive(addressIndex).publicKey;
    return pubkey;
}

const pubkey = getPubkeyFromXpub(xpub, 0);

const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: pubkey, network: bitcoinNetwork, });

console.log('Witness script:')
console.log(p2wpkh.output.toString('hex'))

console.log('P2WPKH address')
console.log(p2wpkh.address) 

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

psbt.addInput({
    hash: '486c02ebc83d3fd819d23ec994af1b7bf332fcd6b3ce15480b4f4cdf19e068df',
    index: 0,
    sequence: 0xffffffff,
    witnessUtxo: {
    script: Buffer.from(p2wpkh.output.toString('hex'),'hex',),
    value: 100000,
    },
});
psbt.addOutput({
    address: "tb1q37qtrf5gghczwczkmpnuemrlh8mxvm5s8tz2wz",
    value: 49859,
});
psbt.addOutput({
    address: "tb1qhpcaf35sn0d780tjpyje6ykz2a4r73p6slfmue",
    value: 50000,
});

const obj = wif.decode(privateKey_wif);

const privKey = bitcoin.ECPair.fromPrivateKey(obj.privateKey);

psbt.signInput(0, privKey);

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);