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

const p2sh = bitcoin.payments.p2sh({
    redeem: p2wpkh
});

console.log('P2SH-P2WPKH address')
console.log(p2sh.address) 

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

const previousRawTx = '02000000000101387eee5dd96c6349fb16ceef466c0b9265e029cd71abe47d7ee0a08621424c360100000000feffffff02b379920000000000160014a13008ccc2f7b83463984b5b4afa65fbbdf87851a08601000000000017a9149c966478e58697e07ba4aec10fa6f3508f4325fa870247304402205dd9a3c774fc720dd7855c79baa19a28b025ff9596959b05dd2767fa22bbe24602201969d84c378222af595bf2addeb929a2dd74e906dc806b2418e47622b18ca8e0012102a37d8b815cea0042b01ce49c9f83ab942c8e4b8a85b3c7aca5b641120d654ea179ce0000';

psbt.addInput({
    hash: 'bb52d8788b686b52c31b1c9998176207a295c513b3254b8e793eb015c22f2ade',
    index: 1,
    redeemScript: p2wpkh.output,
    nonWitnessUtxo: Buffer.from(previousRawTx, 'hex'),
});
psbt.addOutput({
    address: "tb1q2adzgyzuy3msvjjfn3pkghf5fnwtwmxcglw3cuk5gvvv3ahmt63qqqa3n6",
    value: 30000,
});
psbt.addOutput({
    address: "tb1qzwwvqxr2m8l0kt8trnnhaa48awtq45zauflz5y",
    value: 69824,
});

const obj = wif.decode(privateKey_wif);

const privKey = bitcoin.ECPair.fromPrivateKey(obj.privateKey);

psbt.signInput(0, privkey1)
psbt.signInput(0, privkey2);

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);