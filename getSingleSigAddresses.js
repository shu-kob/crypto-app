const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const { xpub } = require('./xpub.json');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

function getPublicKey(xpub, addressIndex){
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(0).derive(addressIndex).publicKey;
    return pubkey
}

const pubkey = getPublicKey(xpub, 0);

function getP2pkhAddress(){
    const address = bitcoin.payments.p2pkh({ pubkey: pubkey, network: bitcoinNetwork, }).address;
    return address;
}

function getP2shP2wpkhAddress(){
    const address = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: pubkey, network: bitcoinNetwork, })
    }).address;
    return address;
}

function getP2wpkhAddress(){
    const address = bitcoin.payments.p2wpkh({ pubkey: pubkey, network: bitcoinNetwork, }).address;
    return address;
}

const p2pkhAddress = getP2pkhAddress(0);
console.log("P2PKH:");
console.log(p2pkhAddress);

const p2shP2wpkhAddress = getP2shP2wpkhAddress(0);
console.log("P2SH-P2WPKH:");
console.log(p2shP2wpkhAddress);

const p2wpkhAddress = getP2wpkhAddress(0);
console.log("P2WPKH:");
console.log(p2wpkhAddress);
