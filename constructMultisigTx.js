const bitcoin =require('bitcoinjs-lib');
const wif = require('wif');
const {alice, bob, carol} = require('./wallets.json')
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;
// let bitcoinNetwork = MAINNET;
let bitcoinNetwork = TESTNET;

const xpriv1 = alice[0].xpriv;
const xpriv2 = bob[0].xpriv;
const xpriv3 = carol[0].xpriv;

const pubKey1 = alice[0].pubKey;
const pubKey2 = bob[0].pubKey;
const pubKey3 = carol[0].pubKey;

function xprivtoPrivkey(xpriv, addressIndex){
    const privKey_buff = bitcoin.bip32.fromBase58(xpriv, bitcoinNetwork).derive(addressIndex);
    console.log("privKey_buff: " + privKey_buff);
    const privKey = privKey_buff.toWIF();
    console.log("privKey: " + privKey);
    
    
    const obj = wif.decode(privKey);
    console.log("obj :" + JSON.stringify(obj));

    console.log(obj.privateKey);

    const privKey_buf = bitcoin.ECPair.fromPrivateKey(obj.privateKey);
    console.log("priKey_buf :" + JSON.stringify(privKey_buf));
    return privKey;
    /*
    return privKey_buff;
    */
}

function privkeyToPubKey(privkey){
    const keyPair = bitcoin.ECPair.fromWIF(privkey, bitcoinNetwork)
    console.log("keyPair.publicKey: ");
    console.log(keyPair.publicKey);
    return keyPair.publicKey;
}

const privkey1 = xprivtoPrivkey(xpriv1, 0);
console.log("privkey1: ");
console.log(privkey1);
const keyPairAlice1 = bitcoin.ECPair.fromWIF(privkey1, bitcoinNetwork)
const Alice1 =  privkeyToPubKey(privkey1);
console.log(Alice1);
console.log(keyPairAlice1);
const privkey2 = xprivtoPrivkey(xpriv2, 0);
console.log("privkey2: ");
console.log(privkey2);
const keyPairBob1 = bitcoin.ECPair.fromWIF(privkey2, bitcoinNetwork)
const Bob1 =  privkeyToPubKey(privkey2);
console.log(Bob1);
console.log(keyPairBob1);
const privkey3 = xprivtoPrivkey(xpriv3, 0);
console.log("privkey3: ");
console.log(privkey3);

const p2ms = bitcoin.payments.p2ms({
    m: 2, pubkeys: [
      Buffer.from(pubKey1, 'hex'),
      Buffer.from(pubKey2, 'hex'),
      Buffer.from(pubKey3, 'hex'),
    ], network: bitcoinNetwork})

console.log(Buffer.from(pubKey1, 'hex'))

console.log('Witness script:')
console.log(p2ms.output.toString('hex'))
console.log()

console.log('Witness script SHA256:')
console.log(bitcoin.crypto.sha256(p2ms.output).toString('hex'))
console.log()

const p2wsh = bitcoin.payments.p2wsh({redeem: p2ms, network: bitcoinNetwork})
console.log('P2WSH address')
console.log(p2wsh.address) 

console.log("p2wsh.redeem.output")
console.log(p2wsh.redeem.output)

const psbt = new bitcoin.Psbt({ network: bitcoinNetwork });
psbt.addInput({
    hash: '87e540d6dbddbc0bece8afbc42da13ce5c70df9582a7ced60b879929757bcdbd',
    index: 1,
    witnessScript: p2wsh.redeem.output,
    witnessUtxo: {
    script: Buffer.from('0020' + bitcoin.crypto.sha256(p2ms.output).toString('hex'), 'hex'),
    value: 100000,
    },
});
psbt.addOutput({
    address: "tb1qls6pvu90yd3jtyd50gwxpaxykv6tysu02scue9",
    value: 99854,
});

psbt.signInput(0, keyPairAlice1)
psbt.signInput(0, keyPairBob1);

psbt.validateSignaturesOfInput(0, Buffer.from(pubKey1, 'hex'))
psbt.validateSignaturesOfInput(0, Buffer.from(pubKey2, 'hex'))
psbt.finalizeAllInputs();

console.log(JSON.stringify(psbt))

const txHex = psbt.extractTransaction().toHex();

console.log(txHex);

