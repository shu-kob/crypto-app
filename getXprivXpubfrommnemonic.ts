import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

function mnemonicToXprivXpub() {
    // const mnemonic: any = process.env.MNEMONIC;
    const mnemonic: any = bip39.generateMnemonic(256);
    console.log("mnemonic: " + mnemonic)
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed, bitcoinNetwork);
    const xpriv = node.derivePath("m/44'/1/0").toBase58();
    console.log("xpriv: " + xpriv);
    const xpub = node.derivePath("m/44'/1/0").neutered().toBase58();
    console.log("xprub: " + xpub);
    return { xpriv, xpub };
}

const { xpriv, xpub } = mnemonicToXprivXpub();
console.log("xpriv: " + xpriv);
console.log("xprub: " + xpub);
