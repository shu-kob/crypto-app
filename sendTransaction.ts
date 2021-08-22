import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';
import * as wif from 'wif';
const TESTNET = bitcoin.networks.testnet;

function mnemonicToPubKey(addressIndex: number) {
    const mnemonic: any = process.env.MNEMONIC;
    console.log("mnemonic: " + mnemonic)
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    const xpriv = node.toBase58();
    console.log("xpriv: " + xpriv);
    const xpub = node.neutered().toBase58();
    console.log("xpub: " + xpub);
    const privKey = node.derivePath("m/44'/0/0/0/0").toWIF();
    console.log("privKey: " + privKey);
    const privKey2 = node.derive(addressIndex).toWIF();
    console.log("privKey2: " + privKey2);
    const pubkey = node.derivePath("m/44'/0/0/0/0").publicKey;
    console.log(pubkey);
    let bip32Interface: BIP32Interface = bip32.fromBase58(xpub);
    return bip32Interface.derive(addressIndex).publicKey;
}

function getp2wpkhAddress(addressIndex: number){
    const pubkey_buf = mnemonicToPubKey(addressIndex);
    console.log(pubkey_buf);
    const address = bitcoin.payments.p2wpkh({ pubkey: pubkey_buf, network: TESTNET, }).address;
    return address;
}

function mnemonicToPrivKey(addressIndex: number) {
    const mnemonic: any = process.env.MNEMONIC;
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    const xpriv = node.toBase58();
    console.log("xpriv: " + xpriv);
    const privKey = node.derive(addressIndex).toWIF();
    console.log("privKey: " + privKey);
    return privKey;
}

const address = getp2wpkhAddress(0);
console.log(address);

const psbt = new bitcoin.Psbt({ network: TESTNET });

psbt.addInput({
    hash: 'f0dcde34d982e476389986e0277f7e1858c2b55c16ddf59306f20c1a950f61a8',
    index: 0,
    sequence: 0xffffffff,

    witnessUtxo: {
    script: Buffer.from(
    '00146ddb9bdfb6dd2ff232fe268f1f7fbc2a714d8f5a',
    'hex',
    ),
    value: 1000000,
    },
});
psbt.addOutput({
    address: 'tb1qv07qxehtj0ylhjg30a9nxnlkc6fh6aymylmlwu',
    value: 919930,
});

const privateKey_wif = mnemonicToPrivKey(0);

const keyPair = bitcoin.ECPair.fromWIF(
    privateKey_wif,
  );
  const address_from_wif = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: TESTNET });

console.log("address_from_wif: " + address_from_wif.address);

const obj = wif.decode(privateKey_wif);
console.log("obj :" + JSON.stringify(obj));
console.log("");
console.log(obj.privateKey);

const priKey_buf = bitcoin.ECPair.fromPrivateKey(obj.privateKey);
console.log("priKey_buf :" + JSON.stringify(priKey_buf));
psbt.signInput(0, priKey_buf);
psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);
