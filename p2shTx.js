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

let addressIndex = 0;

function getPrivkeyFromXpriv(xpriv, addressIndex) {
    const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
    const privateKey_wif = privkeyNode.derive(0).derive(addressIndex).toWIF();
    console.log("privateKey_wif:");
    console.log(privateKey_wif);
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

const p2sh =  bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: bitcoinNetwork, })
})

console.log('P2SH address')
console.log(p2sh.address) 

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

const previousRawTx = '02000000000101975849c88e4d070115063132df177b21445c6aa931f5cd9bcfcefd30b4c885670000000000feffffff023b1aa71300000000160014daa2553adff0c3023634deebbb28ce5fed66a088809698000000000017a91453dc808c188b858a547a20fa71dcc9244be5ef0a8702473044022044584a87d1c5a11da36145089d09d50e7225ea46f7d6f0f9218096ac846b555d022078541f4e189c0a4fd846b1b23ea0fbaa3ed3f453a67dcbe8e8b969f1e19e68fd012103a8a641ca8c2128a09f8ebcd25127a210acfda8dca9218e7b5a381b3d9118b55730d60000';

psbt.addInput({
    hash: '94bab1868a1e7c4f52cba4d95b77ab49508cc738650a523bef45ec374d93b2c3',
    index: 1,
    redeemScript: p2sh.redeem.output,
    nonWitnessUtxo: Buffer.from(previousRawTx, 'hex'),
});
psbt.addOutput({
    address: "tb1q6fjgxhd73fr9w7d60kp8aq9rf20sjyeep8ymx0",
    value: 3000000,
});
psbt.addOutput({
    address: "tb1q6j60yg0ru3vxxsmt7wka4c893pf9na2rlak87z",
    value: 6999631,
});

psbt.signInput(0, privkey2)
psbt.signInput(0, privkey3);

psbt.validateSignaturesOfInput(0, Buffer.from(pubkey2, 'hex'))
psbt.validateSignaturesOfInput(0, Buffer.from(pubkey3, 'hex'))

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);
