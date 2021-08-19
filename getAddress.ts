import * as bitcoin from 'bitcoinjs-lib';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import * as bip39 from 'bip39';
const TESTNET = bitcoin.networks.testnet;

function getRandomPrivKey(){
    const keyPair = bitcoin.ECPair.makeRandom();
    const privKey = keyPair.toWIF()
    console.log("private key WIF: " + privKey);
    console.log("keyPair.publicKey:" + keyPair.publicKey);
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    console.log("random address: " + address.address);
    return privKey;
}

function getTestnetRandomPrivKey(){
    const testnetKeyPair = bitcoin.ECPair.makeRandom({ network: TESTNET });
    const testnetPrivKey = testnetKeyPair.toWIF();
    console.log("testnet private key WIF: " + testnetPrivKey);
    const testnetAddress = bitcoin.payments.p2pkh({ pubkey: testnetKeyPair.publicKey, network: TESTNET, });
    console.log("testnet random address: " + testnetAddress.address);
    return testnetPrivKey;
}

function getP2shAddress(){
    const pubkeys = [
        makePubKey(2),
        makePubKey(2),
        makePubKey(2),
    ].map(Buffer => Buffer);
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
    });
    return address;
}

function getP2shTestnetAddress(){
    const pubkeys = [
        makePubKey(1),
        makePubKey(1),
        makePubKey(1),
    ].map(Buffer => Buffer);
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: TESTNET, }),
    });
    return address;
}

function mnemonicToNode() {
    const mnemonic = bip39.generateMnemonic(256);
    console.log("mnemonic: " + mnemonic)
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed);
    return node;
}

function xpubtoPub() {
    const node = mnemonicToNode();
    const xpriv = node.toBase58();
    console.log(xpriv);
    const xpub = node.neutered().toBase58();
    console.log(xpub);
    const privKey = node.derivePath("m/44'/0/0/0/0").toWIF();
    console.log(privKey);
    const pubkey = node.derivePath("m/44'/0/0/0/0").publicKey;
    console.log(pubkey);
    let bip32Interface: BIP32Interface = bip32.fromBase58(xpub);
    return bip32Interface;
}

const bip32Interface = xpubtoPub();

console.log("xpubtoPub(): " + JSON.stringify(bip32Interface));

const getAddress = (publicKey: any) => {
    return bitcoin.payments.p2pkh({ pubkey: publicKey }).address
}

console.log("bip32Interface: " + JSON.stringify(xpubtoPub()));
let addressIndex = 0;

const pubKey_buff = bip32Interface.derive(addressIndex).publicKey;
console.log(pubKey_buff);

function getMultisigAddress(){
    const pubkeys = [
        '03380eaa099fed61543d27cad48b4288c65a25cd3509ba0181c2f26d1750a6f8ec',
        '02f228a300c0d3310deed09b16ead058f2afc519ab39a3906eaf04b1ad85c6c64f',
        '02c5828ef798fe715c97ecb03564a5b11bb4bf7e408c6813aa51335f6e9e39b4de',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
    });
    return address;
}

const multisigAddressFromPubKey = getMultisigAddress();
console.log("multisigAddressFromPubKey: " +  multisigAddressFromPubKey);

const pubKey = Buffer.from(pubKey_buff).toString('hex');

console.log(pubKey);

function makePubKey(addressIndex: number){
    return bip32Interface.derive(addressIndex).publicKey
}

const address = getAddress(pubKey_buff);

console.log(address);

const multisigAddress = getP2shAddress();
console.log("multisigAddress: " + multisigAddress);

const testnetMultisigAddress = getP2shTestnetAddress();
console.log("testnetMultisigAddress: " + testnetMultisigAddress);

const randomAddress = getRandomPrivKey();

function getP2pkhAddress(){
    const pubkey_buf = makePubKey(1);
    console.log("pubkey_buf: " + pubkey_buf);
    const address = bitcoin.payments.p2pkh({ pubkey: pubkey_buf });
    return address.address;
}

const p2pkhAddress = getP2pkhAddress();
console.log("p2pkhAddress:" + p2pkhAddress);

function getP2pkhTestnetAddress(){
    const pubkey = "031be015696ca8fba3286d19dbc862154a9e7e157d6c5d65cb39d63b84be5929bc";
    const pubkey_buf = Buffer.from(pubkey, 'hex')
    console.log("pubkey_buf: " + pubkey_buf);
    const address = bitcoin.payments.p2pkh({ pubkey: pubkey_buf, network: TESTNET, });
    return address.address;
}

const p2pkhTestnetAddress = getP2pkhTestnetAddress();
console.log("p2pkhTestnetAddress:" + p2pkhTestnetAddress);

function getp2wpkhAddress(){
    const pubkey_buf = makePubKey(1);
    console.log("pubkey_buf: " + pubkey_buf);
    const address = bitcoin.payments.p2wpkh({ pubkey: pubkey_buf, });
    return address.address;
}

const p2wpkhAddress = getp2wpkhAddress();
console.log("p2wpkhAddress: " + p2wpkhAddress);

function getp2wpkhTestnetAddress(){
    const pubkey = "031be015696ca8fba3286d19dbc862154a9e7e157d6c5d65cb39d63b84be5929bc";
    const pubkey_buf = Buffer.from(pubkey, 'hex')
    console.log("pubkey_buf: " + pubkey_buf);
    const address = bitcoin.payments.p2wpkh({ pubkey: pubkey_buf, network: TESTNET, });
    return address.address;
}

const p2wpkhTestnetAddress = getp2wpkhTestnetAddress();
console.log("p2wpkhTestnetAddress: " + p2wpkhTestnetAddress);

function getSegwitMultisigAddress(){
    const pubkeys = [
        '03380eaa099fed61543d27cad48b4288c65a25cd3509ba0181c2f26d1750a6f8ec',
        '02f228a300c0d3310deed09b16ead058f2afc519ab39a3906eaf04b1ad85c6c64f',
        '02c5828ef798fe715c97ecb03564a5b11bb4bf7e408c6813aa51335f6e9e39b4de',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
    });
    return address;
}

const segwitMultisigAddress = getSegwitMultisigAddress();
console.log("p2wsh mainnet: " + segwitMultisigAddress);

function getSegwitMultisigTestnetAddress(){
    const pubkeys = [
        makePubKey(1),
        makePubKey(1),
        makePubKey(1),
    ].map(Buffer => Buffer);
    const { address } = bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: TESTNET, }),
    });
    return address;
}

const segwitMultisigTestnetAddress = getSegwitMultisigTestnetAddress();
console.log("p2wsh testnet: " + segwitMultisigTestnetAddress);

function getP2SHP2WSHAddress(){
    const pubkeys = [
        makePubKey(1),
        makePubKey(1),
        makePubKey(1),
    ].map(Buffer => Buffer);
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wsh({
            redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
        }),
    });
    return address;
}

const P2SHP2WSHAddress = getP2SHP2WSHAddress();
console.log("P2SHP2WSHAddress: " + P2SHP2WSHAddress);

function getP2SHP2WSHTestnetAddress(){
    const pubkeys = [
        '03380eaa099fed61543d27cad48b4288c65a25cd3509ba0181c2f26d1750a6f8ec',
        '02f228a300c0d3310deed09b16ead058f2afc519ab39a3906eaf04b1ad85c6c64f',
        '02c5828ef798fe715c97ecb03564a5b11bb4bf7e408c6813aa51335f6e9e39b4de',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wsh({
            redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: TESTNET, }),
        }),
    });
    return address;
}

const P2SHP2WSHTestnetAddress = getP2SHP2WSHTestnetAddress();
console.log("P2SHP2WSHTestnetAddress: " + P2SHP2WSHTestnetAddress);