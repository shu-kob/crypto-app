# crypto-app

## How to use

### 初回準備

```
git clone https://github.com/shu-kob/crypto-app

cd crypto-app

npm install
```


### シングルシグの鍵とアドレスを生成する場合

```
node getMnemonic.js

node getKeys.js

node getSingleSigAddresses.js
```

### 鍵3つとマルチシグアドレスを生成する場合

```
node getMnemonic.js

node getMultiSigKeys.js

node getSingleSigAddresses.js
```

### トランザクション作成

作成したアドレスに入金する。

*Tx.jsを編集してコードを実行し、RawTxを得る。

例

```
node p2wpkhTx.js
```

得たRawTxをブロードキャストする。

#### bitcoindを使う場合

```
bitcoin-cli sendrawtransaction <rawtx>
```

#### Blockchain Explorerを使う場合

blockstream.infoのBroadcast raw transaction機能を使う

Mainnet
https://blockstream.info/tx/push

Testnet
https://blockstream.info/testnet/tx/push

Signet
https://explorer.bc-2.jp/tx/push
