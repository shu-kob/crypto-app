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

console.log('P2SH-P2WSH address')
console.log(p2sh.address) 

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

const previousRawTx = '02000000000101de2a2fc215b03e798e4b25b313c595a207621798991c1bc3526b688b78d852bb0000000000feffffff0285f29000000000001600146f5fcbf72dd6bce849eb78dc5b984f5cdc69ec0ca08601000000000017a914b54460b9b1339d23d349cdd216ab44314cbeca2a870247304402206a7c7ae6b7135b8091467d72869ef6ee01b5d53ebf24c75e79b0d339c672d5af02206ed9c92a56e91c3ac8afc8abae493e84f59b6a76edbe32360091470bb00b39440121034e87fe334e75b2a1ccb6ef9a6b2beac216d7763f321eeb75c1191889ce191a498ece0000';

psbt.addInput({
    hash: 'f77f76cbc68444716894f5884f99e281c943e7f1832886bc8030cda5d05e803d',
    index: 1,
    redeemScript: p2wsh.output,
    witnessScript: p2wsh.redeem.output,
    nonWitnessUtxo: Buffer.from(previousRawTx, 'hex'),
});
psbt.addOutput({
    address: "tb1q2adzgyzuy3msvjjfn3pkghf5fnwtwmxcglw3cuk5gvvv3ahmt63qqqa3n6",
    value: 30000,
});
psbt.addOutput({
    address: "tb1qzwwvqxr2m8l0kt8trnnhaa48awtq45zauflz5y",
    value: 69776,
});

psbt.signInput(0, privkey2)
psbt.signInput(0, privkey3);

psbt.validateSignaturesOfInput(0, Buffer.from(pubkey2, 'hex'))
psbt.validateSignaturesOfInput(0, Buffer.from(pubkey3, 'hex'))

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);