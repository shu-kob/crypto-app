const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const mnemonic = "eight plate hero tape describe absent betray address year logic bicycle control slush lemon snake bronze salad donor royal first myself rough syrup define";

function mnemonicToXprivXpub(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed, bitcoinNetwork);
    const xpriv = node.toBase58();
    const xpub = node.derivePath("m/44'/1/0").neutered().toBase58();
    return { xpriv, xpub };
}

const { xpriv, xpub } = mnemonicToXprivXpub();
console.log("xpriv: " + xpriv);
console.log("xpub:  " + xpub);