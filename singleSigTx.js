const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const wif = require('wif');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const xpriv = "tprv8gPHaXkdRLgnE1NgPqZPkH1ffYBiQkuAVowFDi5rGDuxj19vuBsD53cmXHxq8u4gmDv9t8a2YaY56roA8KNZRNTNSe6Yv6jVdDhUvxYbcRj";

const privkeyNode = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork);
const privateKey_wif = privkeyNode.derive(1).derive(0).derive(0).derive(0).toWIF();
console.log("privateKey_wif:");
console.log(privateKey_wif);

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });

psbt.addInput({
    hash: '364c422186a0e07e7de4ab71cd29e065920b6c46efce16fb49636cd95dee7e38',
    index: 0,
    sequence: 0xffffffff,

    witnessUtxo: {
    script: Buffer.from(
    '0014139cc0186ad9fefb2ceb1ce77ef6a7eb960ad05d',
    'hex',
    ),
    value: 100000,
    },
});
psbt.addOutput({
    address: "tb1q2adzgyzuy3msvjjfn3pkghf5fnwtwmxcglw3cuk5gvvv3ahmt63qqqa3n6",
    value: 70000,
});
psbt.addOutput({
    address: "tb1qzwwvqxr2m8l0kt8trnnhaa48awtq45zauflz5y",
    value: 29847,
});

const obj = wif.decode(privateKey_wif);

const privKey = bitcoin.ECPair.fromPrivateKey(obj.privateKey);

psbt.signInput(0, privKey);

psbt.validateSignaturesOfInput(0);
psbt.finalizeAllInputs();
const txHex = psbt.extractTransaction().toHex();

console.log(txHex);