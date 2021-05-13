# ポモドーる？  
## 書籍管理機能つきのポモドーロタイマー
![](./documents/Group1.jpg)
20210501制作開始   
20210514デプロイ
## 落ち着いた背景とポモドーロタイマーで集中力を高めて読書ができ、その回数や感想を記録します
***
## 書籍管理画面はファミコン風のデザインを施し、ゲームのアイテム集めをするような感覚でどんどん自分の書籍を登録できます
***
https://pomodo-lu.web.app/  
`PC向けWebアプリです`
## 機能概要
ポモドーロタイマー
- 標準的なタイマー機能(25分+5分で１セットを繰り返します)
- 上記を１回としたその書籍に対するポモドーロ回数の記録機能
- ポモドーロタイマー起動中のメモ書き込み機能

書籍管理
- 書籍検索機能
- カメラを使ったISBNコードでの検索機能
- 登録書籍の内容編集機能
***
## 使用技術
`javascript`
- pure.js
- フレームワーク無しで疑似SPAを実装  

`nes.css`
- ファミコン風ライブラリ
- 書籍管理画面に使用
- ポモドーロ画面は落ち着いた雰囲気で

`googlebooksAPI`
- 書籍検索に使用

`firebase hosting`
- ホスティング

`firebase auth`
- ログイン機能

`firebase firestore`
- 書籍データ保存
- ユーザーデータの保存

`anime.js`
- インタラクションの向上(未実装)

`QuaggaJS`
- バーコードスキャン用ライブラリ
***

## やり残していること
- レスポンシブ対応
- スワイプ機能
- 書籍管理画面のつくりこみ（もっとファミコンにしたい）
- アニメーションをつけたい
- スキャン機能の精度向上(不安定)