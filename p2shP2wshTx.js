const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const wif = require('wif');
const { xpub1, xpub2, xpub3 } = require('./xpubs.json');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const { xpriv1 } = require('./xpriv1.json');
const { xpriv2 } = require('./xpriv2.json');
const { xpriv3 } = require('./xpriv3.json');

let addressIndex = 0;

function getPrivkeyFromXpriv(xpriv, addressIndex) {
    const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
    const privateKey_wif = privkeyNode.derive(0).derive(addressIndex).toWIF();
    console.log("privateKey_wif:\n" + privateKey_wif);
    const obj = wif.decode(privateKey_wif);
    const privkey = bitcoin.ECPair.fromPrivateKey(obj.privateKey);
    return privkey;
}

const privkey1 = getPrivkeyFromXpriv(xpriv1, addressIndex);
const privkey2 = getPrivkeyFromXpriv(xpriv2, addressIndex);
const privkey3 = getPrivkeyFromXpriv(xpriv3, addressIndex);

function getPubkeyFromXpub(xpub, addressIndex) {
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(0).derive(addressIndex).publicKey;
    return pubkey;
}

const pubkey1 = getPubkeyFromXpub(xpub1, addressIndex);
const pubkey2 = getPubkeyFromXpub(xpub2, addressIndex);
const pubkey3 = getPubkeyFromXpub(xpub3, addressIndex);

const pubkeys = [
    pubkey1,
    pubkey2,
    pubkey3,
].map(Buffer => Buffer);

const p2wsh =  bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, })
})

const p2sh = bitcoin.payments.p2sh({
    redeem: p2wsh
});

console.log('P2SH-P2WSH address:\n' + p2sh.address);

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

const previousRawTx = '02000000000101397816bc0ebdbab388efbdffef171c79b8cf18519385131dda1432e61401f75f0000000000ffffffff02808d5b000000000017a9142f5f41088f837f36925b277cf4f97e5b77d58e7d87c2831e0000000000220020418d66a5fc9b7182feb920a88198dd755bd5e7897e562cd1ba39c236a91a1bfc040047304402202549b3e56ceb5562bac9691abf19d4c8c2a453580e732f788a755ce33d477ae602205306aaa5dc9bfc185ef6fc350f2c18c60c3d199f1c2620426f8955baa57176a801483045022100d8e8367c02269c9da9dfa03774a33456aa529f7e5008cb566c00998096dec43602202b163e10a7523a4701326322f59bcd13bca807a8454efdb0864a566433291a9801695221021d0abb918de315b7714b97d37a8105a271ad2d291e2c4eb5042ab50ab545494f2102bc527ea1d670def3afc5f60b36b7f194510c8d54568468845f061f77e4bf2a032102d0a09bd913cb01f44a7c656bab9a8b80b648c24139d039af8d01aed5679f8e6153ae00000000';

psbt.addInput({
    hash: 'f131cfd38f5020aa589bb9190e295ffb24cc569133b9b8d5826ef85a0a644a9a',
    index: 0,
    redeemScript: p2wsh.output,
    witnessScript: p2wsh.redeem.output,
    nonWitnessUtxo: Buffer.from(previousRawTx, 'hex'),
});
psbt.addOutput({
    address: "mt8xMnq8MGPSHC42hfFc8xuTxJ3uqoJTA9",
    value: 4000000,
});
psbt.addOutput({
    address: "mj12LAXrTjvyQQBBJQg1MqhN2JHHWxc8QZ",
    value: 1700000,
});
psbt.addOutput({
    address: "mqhpyiCtz9xL9YZMc4QrBEbKZDUBnAQiU8",
    value: 200000,
});
psbt.addOutput({
    address: "2Myv2XaqYXiM5ttNiG4jvtALrCmE6qJRCtZ",
    value: 99716,
});

psbt.signInput(0, privkey2)
psbt.signInput(0, privkey3);

psbt.validateSignaturesOfInput(0, Buffer.from(pubkey2, 'hex'))
psbt.validateSignaturesOfInput(0, Buffer.from(pubkey3, 'hex'))

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log("RawTx:\n" + txHex);
