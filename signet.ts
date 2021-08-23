import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';
import * as wif from 'wif';
const TESTNET = bitcoin.networks.testnet;
let bitcoinNetwork = TESTNET;

function mnemonicToPubKey(addressIndex: number) {
    const mnemonic: any = process.env.MNEMONIC;
    console.log("mnemonic: " + mnemonic)
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed, bitcoinNetwork);
    const xpriv = node.toBase58();
    console.log("xpriv: " + xpriv);
    const xpub = node.neutered().toBase58();
    console.log("xpub: " + xpub);
    const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
    const privKey = privkeyNode.derive(1).derive(0).derive(0).derive(addressIndex).toWIF();
    console.log("privKey: " + privKey);
    // const privKey2 = node.derive(addressIndex).toWIF();
    // console.log("privKey2: " + privKey2);
    const pubkeyNode = bitcoin.bip32.fromBase58(xpub, bitcoinNetwork);
    const pubkey = pubkeyNode.derive(1).derive(0).derive(0).derive(0).publicKey;
    console.log(pubkey);
    return pubkey;
}

function getp2wpkhAddress(addressIndex: number){
    const pubkey_buf = mnemonicToPubKey(addressIndex);
    const address = bitcoin.payments.p2wpkh({ pubkey: pubkey_buf, network: bitcoinNetwork, }).address;
    return address;
}

function mnemonicToPrivKey(addressIndex: number) {
    const mnemonic: any = process.env.MNEMONIC;
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed, bitcoinNetwork);
    const xpriv = node.toBase58();
    console.log("xpriv2: " + xpriv);
    const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
    const privKey = privkeyNode.derive(1).derive(0).derive(0).derive(addressIndex).toWIF();
    console.log("privKey2: " + privKey);
    return privKey;
}

const address1: any = getp2wpkhAddress(0);
console.log(address1);

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

psbt.addInput({
    hash: '604e05b905b14f2349a4c38646a58149027141ab6f68396b30f495a10b13fa75',
    index: 0,
    sequence: 0xffffffff,

    witnessUtxo: {
    script: Buffer.from(
    '00141ff835cf4b709b614a4b79f1060699b768982ff9',
    'hex',
    ),
    value: 31987392,
    },
});
psbt.addOutput({
    address: "tb1qls6pvu90yd3jtyd50gwxpaxykv6tysu02scue9",
    value: 10000000,
});
psbt.addOutput({
    address: address1,
    value: 21987251,
});

const privateKey_wif = mnemonicToPrivKey(0);

const keyPair = bitcoin.ECPair.fromWIF(
    privateKey_wif, bitcoinNetwork
  );
  const address_from_wif = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoinNetwork }).address;

console.log("address_from_wif: " + address_from_wif);

const obj = wif.decode(privateKey_wif);
console.log("obj :" + JSON.stringify(obj));

console.log(obj.privateKey);

const priKey_buf = bitcoin.ECPair.fromPrivateKey(obj.privateKey);
console.log("priKey_buf :" + JSON.stringify(priKey_buf));
console.log("01");
psbt.signInput(0, priKey_buf);
console.log("02");
psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);
