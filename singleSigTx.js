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

const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
const privateKey_wif = privkeyNode.derive(1).derive(0).derive(0).derive(0).toWIF();
console.log("privateKey_wif:");
console.log(privateKey_wif);

function getPubkeyFromXpub(xpub) {
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(1).derive(0).derive(0).derive(0).publicKey;
    return pubkey;
}

const pubkey = getPubkeyFromXpub(xpub);

const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: pubkey, network: bitcoinNetwork, });

console.log('Witness script:')
console.log(p2wpkh.output.toString('hex'))

console.log('P2WPKH address')
console.log(p2wpkh.address) 

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

psbt.addInput({
    hash: '364c422186a0e07e7de4ab71cd29e065920b6c46efce16fb49636cd95dee7e38',
    index: 0,
    sequence: 0xffffffff,

    witnessUtxo: {
    script: Buffer.from(p2wpkh.output.toString('hex'),'hex',),
    value: 100000,
    },
});
psbt.addOutput({
    address: "tb1q2adzgyzuy3msvjjfn3pkghf5fnwtwmxcglw3cuk5gvvv3ahmt63qqqa3n6",
    value: 70000,
});
psbt.addOutput({
    address: "tb1qzwwvqxr2m8l0kt8trnnhaa48awtq45zauflz5y",
    value: 29890,
});

const obj = wif.decode(privateKey_wif);

const privKey = bitcoin.ECPair.fromPrivateKey(obj.privateKey);

psbt.signInput(0, privKey);

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);