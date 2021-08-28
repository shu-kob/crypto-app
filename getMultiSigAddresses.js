const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const { xpub1, xpub2, xpub3 } = require('./xpubs.json');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const pubkeyNode1 = bitcoin.bip32.fromBase58(xpub1, bitcoinNetwork);
const pubkey1 = pubkeyNode1.derive(1).derive(0).derive(0).derive(0).publicKey;

const pubkeyNode2 = bitcoin.bip32.fromBase58(xpub2, bitcoinNetwork);
const pubkey2 = pubkeyNode2.derive(1).derive(0).derive(0).derive(0).publicKey;

const pubkeyNode3 = bitcoin.bip32.fromBase58(xpub3, bitcoinNetwork);
const pubkey3 = pubkeyNode3.derive(1).derive(0).derive(0).derive(0).publicKey;

const pubkeys = [
    pubkey1,
    pubkey2,
    pubkey3,
].map(Buffer => Buffer);

function getP2shAddress(){
    const address = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, }),
    }).address;
    return address;
}

function getP2shP2wshAddress(){
    const address = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wsh({
            redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, })
        }),
    }).address;
    return address;
}

function getP2wshAddress(){
    const address = bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, }),
    }).address;
    return address;
}

const p2shAddress = getP2shAddress();
console.log("P2SH:");
console.log(p2shAddress);

const p2shP2wshAddress = getP2shP2wshAddress();
console.log("P2SH-P2WSH:");
console.log(p2shP2wshAddress);

const p2wshAddress = getP2wshAddress();
console.log("P2WSH:");
console.log(p2wshAddress);