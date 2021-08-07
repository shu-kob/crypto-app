let bitcoin = require('bitcoinjs-lib');
const TESTNET = bitcoin.networks.testnet;

function getRandomPrivKey(){
    const keyPair = bitcoin.ECPair.makeRandom();
    console.log("private key WIF:\n" + keyPair.toWIF());
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    console.log("random address:\n" + address.address);
    return keyPair.toWIF();
}

function getTestnetRandomPrivKey(){
    const testnetKeyPair = bitcoin.ECPair.makeRandom({ network: TESTNET });
    console.log("testnet private key WIF:\n" + testnetKeyPair.toWIF());
    const testnetAddress = bitcoin.payments.p2pkh({ pubkey: testnetKeyPair.publicKey, network: TESTNET, });
    console.log("testnet random address:\n" + testnetAddress.address);
    return testnetKeyPair.toWIF();
}

const RandomPrivKey = getRandomPrivKey();

console.log(RandomPrivKey);

const RandomTestnetPrivKey = getTestnetRandomPrivKey();

console.log(RandomTestnetPrivKey);