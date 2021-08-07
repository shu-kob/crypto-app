let bitcoin = require('bitcoinjs-lib');
const TESTNET = bitcoin.networks.testnet;

function getRandomPrivKey(){
    const keyPair = bitcoin.ECPair.makeRandom();
    const privKey = keyPair.toWIF()
    console.log("private key WIF:\n" + privKey);
    const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    console.log("random address:\n" + address.address);
    return privKey;
}

function getTestnetRandomPrivKey(){
    const testnetKeyPair = bitcoin.ECPair.makeRandom({ network: TESTNET });
    const testnetPrivKey = testnetKeyPair.toWIF();
    console.log("testnet private key WIF:\n" + testnetPrivKey);
    const testnetAddress = bitcoin.payments.p2pkh({ pubkey: testnetKeyPair.publicKey, network: TESTNET, });
    console.log("testnet random address:\n" + testnetAddress.address);
    return testnetPrivKey;
}

const RandomPrivKey = getRandomPrivKey();

console.log(RandomPrivKey);

const RandomTestnetPrivKey = getTestnetRandomPrivKey();

console.log(RandomTestnetPrivKey);