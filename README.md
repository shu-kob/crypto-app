# crypto-app

## How to use

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
getMnemonic.js

getMultiSigKeys.js

getSingleSigAddresses.js
```

### トランザクション作成

*Tx.jsを編集してRawTxを得る。得たRawTxをブロードキャストする。
