import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';
const TESTNET = bitcoin.networks.testnet;

function getRandomPrivKey(){
    const keyPair = bitcoin.ECPair.makeRandom();
    const privKey = keyPair.toWIF()
    console.log("private key WIF: " + privKey);
    console.log(keyPair.publicKey);
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    console.log("random address: " + address.address);
    return privKey;
}

function getTestnetRandomPrivKey(){
    const testnetKeyPair = bitcoin.ECPair.makeRandom({ network: TESTNET });
    const testnetPrivKey = testnetKeyPair.toWIF();
    console.log("testnet private key WIF: " + testnetPrivKey);
    const testnetAddress = bitcoin.payments.p2pkh({ pubkey: testnetKeyPair.publicKey, network: TESTNET, });
    console.log("testnet random address: " + testnetAddress.address);
    return testnetPrivKey;
}

function getP2shAddress(){
    const pubkeys = [
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
    });
    return address;
}

function getP2shTestnetAddress(){
    const pubkeys = [
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: TESTNET, }),
    });
    return address;
}

function mnemonicToNode() {
    const mnemonic = bip39.generateMnemonic(256);
    console.log("mnemonic: " + mnemonic)
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    return node;
}

function xpubtoPub() {
    const node = mnemonicToNode();
    const xpriv = node.toBase58();
    console.log(xpriv);
    const xpub = node.neutered().toBase58();
    const privKey = node.derivePath("m/44'/0/0/0/0").toWIF();
    console.log(privKey);
    let bip32Interface: BIP32Interface = bip32.fromBase58(xpub);
    return bip32Interface;
}

const xpub = xpubtoPub();

console.log("xpub: " + xpub);

const getAddress = (publicKey: any) => {
    return bitcoin.payments.p2pkh({ pubkey: publicKey }).address
}

console.log("bip32Interface: " + JSON.stringify(xpubtoPub()));
let addressIndex = 0;
const pubKey = xpub.derive(addressIndex).publicKey;

const address = getAddress(pubKey);

console.log(address);