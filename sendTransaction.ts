import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';
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
    const pubkey = node.derivePath("m/44'/0/0/0/0").publicKey;
    console.log("pubkey: " + pubkey);
    let bip32Interface: BIP32Interface = bip32.fromBase58(xpub);
    return bip32Interface.derive(addressIndex).publicKey
}

function getp2wpkhAddress(addressIndex: number){
    const pubkey_buf = mnemonicToPubKey(addressIndex);
    console.log("pubkey_buf: " + pubkey_buf);
    const address = bitcoin.payments.p2wpkh({ pubkey: pubkey_buf, network: TESTNET, });
    return address.address;
}

const address = getp2wpkhAddress(0);
console.log(address);
