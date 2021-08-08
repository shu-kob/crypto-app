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

function getP2shAddress(){
    const pubkeys = [
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
    });
    return address;
}

function getP2shTestnetAddress(){
    const pubkeys = [
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network: TESTNET, }),
    });
    return address;
}

const p2phAddress = getP2shAddress();
console.log(p2phAddress);

const p2phTestnetAddress = getP2shTestnetAddress();
console.log(p2phTestnetAddress);