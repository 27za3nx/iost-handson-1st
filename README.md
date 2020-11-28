# IOST Handson 1st

## 概要

手数料の分割支払い（割り勘）を行うスマートコントラクトです。

## 使用方法

### パッケージのインストール

```
npm install
```
### テストネットのアカウントを作成

[アカウント作成リンク](http://54.249.186.224/applyIOST)

1. 「Generate KeyPair for me」にチェックを入れる。
2. Account Name を入力する。a-z, 0-9, _ が使用できます。5〜11文字で入力してください。また、重複したIDは登録できません。
3. Emailに適当なアドレスを入力してください。（メールでの認証等はありませんので、使っていない適当なアドレスで構いません。）
4. reCAPTCHAにチェックを入れcreateボタンを押してください。
5. しばらくしたら、画面に「Private Key」が表示されます。この長い英数文字列をコピーしてください。

### アカウント情報の保存

※今回紹介する方法は、セキュリティの観点から問題があります。ハンズオンなので、簡単な方法として紹介していますが、実際の環境では安全な方法でアカウント情報を保存してください。

```config/account.json```に、先程作成したアカウントのIDと秘密鍵を入力してください。

## コマンド

### アカウントの環境関連
ストレージの利用トークンを購入する。

```
npm run ram amount:3000
```


トランザクション発行手数料トークンを購入する。

```
npm run gas amount:10
```

トークンの残高を確認。

```
npm run balance id:<<account_id_or_contract_address>>
```


### スマートコントラクトのデプロイなど
スマートコントラクトのデプロイを実行する。

```
npm run publish
```

デプロイしたスマートコントラクトのアップデートを実行する。

```
npm run update
```


### スマートコントラクトの実行例

```payment_id = "test_01", "total_amount = "30", payers_length = 1``` で支払いを作成。

```
npm run warikan:set pid:test_01 amount:30 length:1
```

```payment_id = "test_01"```の支払いを実行。

```
npm run warikan:pay pid:test_01
```

```payment_id = "test_01"```の支払いを精算。

```
npm run warikan:check pid:test_01
```

```payment_id = "test_01"```の支払い情報を表示。

```
npm run warikan:view pid:test_01
```