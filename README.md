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

### マルチシグの鍵とアドレスを生成する場合

```
node getMnemonic.js

node getMultiSigKeys.js

node getSingleSigAddresses.js
```

### トランザクション作成

作成したアドレスに入金する。

*Tx.jsを編集してコードを実行し、RawTxを得る。

得たRawTxをブロードキャストする。
