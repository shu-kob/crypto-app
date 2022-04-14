const bitcoin = require('bitcoinjs-lib');
const bip32 = require('bip32');
const bip39 = require('bip39');
const fs = require("fs");
const { mnemonic } = require('./mnemonic.json');
const MAINNET = bitcoin.networks.bitcoin;
const TESTNET = bitcoin.networks.testnet;

const LITECOIN = {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
};

const DOGECOIN = {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e
};

const QTUM = {
    messagePrefix: '\x19Qtum Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3A,
    scriptHash: 0x32,
    wif: 0x80
};

let bitcoinNetwork = TESTNET; // MAINNET, TESTNET, LITECOIN, DOGECOIN or QTUM

let purpose = "44"

let coinType = null;

if (bitcoinNetwork == MAINNET) {
    coinType = "0";
}
else if (bitcoinNetwork == TESTNET) {
    coinType = "1";
}
else if (bitcoinNetwork == LITECOIN) {
    coinType = "2";
}
else if (bitcoinNetwork == DOGECOIN) {
    coinType = "3";
}
else if (bitcoinNetwork == QTUM) {
    coinType = "2301";
}

let account = "0"

const path = `m/${purpose}'/${coinType}'/${account}'`

console.log("path:\n" + path);

function getXprivXpubfromMnemonic(mnemonic) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const node = bip32.fromSeed(seed, bitcoinNetwork);
    const xpriv = node.derivePath(path).toBase58();
    const xpub = node.derivePath(path).neutered().toBase58();
    return { xpriv, xpub };
}

const { xpriv, xpub } = getXprivXpubfromMnemonic(mnemonic);

const xprivData = `{\n  "xpriv": "${xpriv}"\n}`

fs.writeFile("xpriv.json", xprivData, (err) => {
    if (err) throw err;
    console.log("xpriv:\n" + xpriv);
});

const xpubData = `{\n  "xpub": "${xpub}"\n}`

fs.writeFile("xpub.json", xpubData, (err) => {
    if (err) throw err;
    console.log("xpub:\n" + xpub);
});
