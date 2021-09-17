const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const { xpub1, xpub2, xpub3 } = require('./xpubs.json');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

function getPublicKey(xpub, addressIndex){
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(0).derive(addressIndex).publicKey;
    return pubkey
}

function getChangePublicKey(xpub, addressIndex){
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(1).derive(addressIndex).publicKey;
    return pubkey
}

let addressIndex = 0;

const pubkey1 = getPublicKey(xpub1, addressIndex);
const pubkey2 = getPublicKey(xpub2, addressIndex);
const pubkey3 = getPublicKey(xpub3, addressIndex);

const changePubkey1 = getChangePublicKey(xpub1, addressIndex);
const changePubkey2 = getChangePublicKey(xpub2, addressIndex);
const changePubkey3 = getChangePublicKey(xpub3, addressIndex);

const pubkeys = [
    pubkey1,
    pubkey2,
    pubkey3,
].map(Buffer => Buffer);

const changePubkeys = [
    changePubkey1,
    changePubkey2,
    changePubkey3,
].map(Buffer => Buffer);

function getP2shAddress(pubkeys){
    const address = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, }),
    }).address;
    return address;
}

function getP2shP2wshAddress(pubkeys){
    const address = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wsh({
            redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, })
        }),
    }).address;
    return address;
}

function getP2wshAddress(pubkeys){
    const address = bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, }),
    }).address;
    return address;
}

const p2shAddress = getP2shAddress(pubkeys);
console.log("P2SH:");
console.log(p2shAddress);

const p2shChangeAddress = getP2shAddress(changePubkeys);
console.log("change:");
console.log(p2shChangeAddress);

const p2shP2wshAddress = getP2shP2wshAddress(pubkeys);
console.log("P2SH-P2WSH:");
console.log(p2shP2wshAddress);

const p2shP2wshChangeAddress = getP2shP2wshAddress(changePubkeys);
console.log("change:");
console.log(p2shP2wshChangeAddress);

const p2wshAddress = getP2wshAddress(pubkeys);
console.log("P2WSH:");
console.log(p2wshAddress);

const p2wshChangeAddress = getP2wshAddress(changePubkeys);
console.log("change:");
console.log(p2wshChangeAddress);