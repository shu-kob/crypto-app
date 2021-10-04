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
    console.log("privateKey_wif:\n" + privateKey_wif);
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

console.log('Witness script:\n' + p2wpkh.output.toString('hex'))

console.log('P2WPKH address:\n' + p2wpkh.address);

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

psbt.addInput({
    hash: '5ff70114e63214da1d1385935118cfb8791c17efffbdef88b3babd0ebc167839',
    index: 0,
    sequence: 0xffffffff,
    witnessUtxo: {
    script: Buffer.from(p2wpkh.output.toString('hex'),'hex',),
    value: 8000000,
    },
});
psbt.addOutput({
    address: "2MwZhrfcLDFJX1PG2LhuUJPzDiqMFxzSQ4G",
    value: 6000000,
});
psbt.addOutput({
    address: "tb1qgxxkdf0undcc9l4eyz5grxxaw4dateuf0etze5d688prd2g6r07qgq9jdr",
    value: 2999999,
});

const obj = wif.decode(privateKey_wif);

const privKey = bitcoin.ECPair.fromPrivateKey(obj.privateKey);

psbt.signInput(0, privKey);

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log("RawTx:\n" + txHex);
