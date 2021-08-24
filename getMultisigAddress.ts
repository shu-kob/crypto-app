import * as bitcoin from 'bitcoinjs-lib';
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const xpub1 = "tpubDCCFgyAsBTHX9fXKagBqwt5WWvEB4JyRh1BiuqKiicrbb1kuFVocng3kU83woVn5pjt3bj1hdMvFbb58dcEfuTVy4NL5YLYRE8rJRBHt3Kz";
const xpub2 = "tpubDDBeBq4PJAnmzazKfsmuSYYQ2mDCvvrpvYqf2DYfbyKBYQ59bxbk6mWZQuUR7FB7KwuyM6RkQbu6z4T8UZMsoastecnB7qu4xZvzffiwEDn";
const xpub3 = "tpubDCDfMhjGVefGBQDwst9qWg7vxs3h3CAhm5PSupzfXrKiccXf7w6yKhpSszhS3vy6qAiUcCHYnAnLBQXySC5EZe1rrVhNTFJjVVTxVGirAaR";

function xpubtoPubkey(xpub: any, addressIndex: number){
    const pubKey_buff = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork).derive(addressIndex).publicKey;
    const pubKey = Buffer.from(pubKey_buff).toString('hex');
    return pubKey;
}

const pubkey1 = xpubtoPubkey(xpub1, 0);
console.log("pubkey1: " + pubkey1);
const pubkey2 = xpubtoPubkey(xpub2, 0);
console.log("pubkey2: " + pubkey2);
const pubkey3 = xpubtoPubkey(xpub3, 0);
console.log("pubkey3: " + pubkey3);


function getP2wshAddress(){
    const pubkeys = [
        pubkey1,
        pubkey2,
        pubkey3,
    ].map(hex => Buffer.from(hex, 'hex'));
    const address = bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, })
    }).address;
    return address;
}

const p2wshAddress = getP2wshAddress();
console.log("getP2wshAddress: " + p2wshAddress);