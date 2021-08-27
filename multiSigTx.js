const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const wif = require('wif');
const {xpub1, xpub2, xpub3} = require('./xpubs.json');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const xpriv1 = require('./xpriv1.json').xpriv;
const xpriv2 = require('./xpriv2.json').xpriv;
const xpriv3 = require('./xpriv3.json').xpriv;

function getPrivkeyFromXpriv(xpriv) {
    const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
    const privateKey_wif = privkeyNode.derive(1).derive(0).derive(0).derive(0).toWIF();
    console.log("privateKey_wif:");
    console.log(privateKey_wif);
    const obj = wif.decode(privateKey_wif);
    const privkey = bitcoin.ECPair.fromPrivateKey(obj.privateKey);
    return privkey;
}

const privkey1 = getPrivkeyFromXpriv(xpriv1);
const privkey2 = getPrivkeyFromXpriv(xpriv2);
const privkey3 = getPrivkeyFromXpriv(xpriv3);

function getPubkeyFromXpub(xpub) {
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(1).derive(0).derive(0).derive(0).publicKey;
    return pubkey;
}

const pubkey1 = getPubkeyFromXpub(xpub1);
const pubkey2 = getPubkeyFromXpub(xpub2);
const pubkey3 = getPubkeyFromXpub(xpub3);

const p2ms = bitcoin.payments.p2ms({
    m: 2, pubkeys: [
      Buffer.from(pubkey1, 'hex'),
      Buffer.from(pubkey2, 'hex'),
      Buffer.from(pubkey3, 'hex'),
    ], network: bitcoinNetwork})

console.log('Witness script:')
console.log(p2ms.output.toString('hex'))

const p2wsh = bitcoin.payments.p2wsh({redeem: p2ms, network: bitcoinNetwork})
console.log('P2WSH address')
console.log(p2wsh.address) 

console.log("p2wsh.redeem.output")
console.log(p2wsh.redeem.output)

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });
psbt.addInput({
    hash: '19fdd3ba91d7b7e2a05a49cdf20998334d5e5a774025e8cb51bfc2c4d06c364b',
    index: 0,
    witnessScript: p2wsh.redeem.output,
    witnessUtxo: {
    script: Buffer.from('0020' + bitcoin.crypto.sha256(p2ms.output).toString('hex'), 'hex'),
    value: 70000,
    },
});
psbt.addOutput({
    address: "tb1qzwwvqxr2m8l0kt8trnnhaa48awtq45zauflz5y",
    value: 40000,
});
psbt.addOutput({
    address: "tb1q2adzgyzuy3msvjjfn3pkghf5fnwtwmxcglw3cuk5gvvv3ahmt63qqqa3n6",
    value: 29811,
});

psbt.signInput(0, privkey1)
psbt.signInput(0, privkey2);

psbt.validateSignaturesOfInput(0, Buffer.from(pubkey1, 'hex'))
psbt.validateSignaturesOfInput(0, Buffer.from(pubkey2, 'hex'))
psbt.finalizeAllInputs();

console.log(JSON.stringify(psbt))

const txHex = psbt.extractTransaction().toHex();

console.log(txHex);
