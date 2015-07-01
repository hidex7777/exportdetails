# exportDetailsプラグインの試案

## TODO
- 日付情報の整形。done
- <del>キャシュ先にしているtextareaを可視化したいと思う（ボタン押下の目視チェックにもなるので）。半分done。スクロールを整形する。</del>
- コードの簡素化。
- WebStorageを使ってみる。
    - localStorageはIITCがすでにだいぶ使っているのでsessionStrageを使うことにする。
- 2回押したときは、後から押した方で先に出ていたデータを上書きする。

## 注意点
- IITCの独自プラグインに当たるかも知れず、使用するとBANになる可能性がなきにしもあらず、であることをよく理解したうえで使うべし。
- Chrome + Tempermonkeyでしかテストしておらず。
- IITC本体の他にportal-listプラグインを入れていることを想定している（必須ではない）。
- Tempermonkeyのダッシュボードのエディターにコピペ、保存してインストール。
- もしくは[https://github.com/hidex7777/exportdetails/blob/master/plugins/export-dedails.user.js](https://github.com/hidex7777/exportdetails/blob/master/plugins/export-dedails.user.js)で「RAW」をクリックでインストール。
- 2015.06.30時点：タイプのエラーが出ている。2回クリックするとダブる。

## 目的と動作、仕様
- IITCでPortal listもしくは直接ポータルを選択してポータル詳細を表示する。
- エクスポート（E）ボタンで詳細をキャッシュに書き出す。
- downloadリンクから、ポータル詳細たちをテキストファイルに書き込んだものをダウンロード。
- CSVの方がいいですか？　いちおうテキストファイルにはCSV形式で書き出しています。

## 必要な情報
- 取得日時（いるかな？　テキストファイルには書き出さないようにしました）
- ポータル名
- RESかENLかnone（中立）か
- 現レベル
- ［P8ならばスキップ］各レゾネータレベル
- ［P8ならばスキップ］入っているR8の数
- 8マイナスR8数であとR8がいくつでP8になるか（例：P8のとき「@0」R8が7本のとき「@1」）
- インストール済みMODの数・空きスロット数
- 各MODをチェックし、省略記号で書く
    - CPS（Common Portal Shield）
    - RPS（Rare Portal Shield）
    - VRPS（Very rare Portal Shield）
    - AXA（Very rare AXA Shield）
    - CHS（Common Heat Sink）
    - RHS（Rare Heat Sink）
    - VRHS（Very rare Heat Sink）
    - CMH（Common Multi-hack）
    - RMH（Rare Multi-hack）
    - VRMH（Very rare Multi-hack）
    - TU（Rare Turret）
    - FA（Rare Force Amp）
    - LA（Rare Link Amp）
    - VRLA（？）
    - SBUL（Very rare SoftBank Ultra Link）
    - 文字列判定に引っかからなくて、かつ空きスロットでない時は、そのままの文字列で
    - none（空きスロット）
- shielding
- AP Gain
- 書き出し例：金透こみち, L7, RES, @1, Shielding: 2000, AP: 1150, CPS, CPS, TU, FA, last update: yyyymmdd hh:mm

## IITCの仕様（分かった部分だけ）
- div#portaldetailsにポータル詳細が記載。
- div#portaldetailsの内容が空のとき、ポータルが選択されていない。
- div#portaldetailsのclass属性の値がenlのときENLポタ、resのときRESポタ、noneのとき中立。
- div#portaldetails > h3.titleタグの内容がポータル名。
- div#portaldetails > div.imgpreview > span#levelダグの内容がポータルレベル。
- div#portaldetails > div.modsにMODsのインストール状況が記載。
    - spanタグが4つ並ぶ＝例：RPSのとき「span title="Rare Portal Shield～"」span要素の中身が「Rare Portal Shield」、MODが入っていないとき「title属性がなく、style属性のみある」。
- div#portaldetails > table#randdetails > tbody > tr[2] > td+spanの内容がシールディング値。
- div#portaldetails > table#randdetails > tbody > tr[3] > td+spanの内容がAP Gain値。ただし、4桁目と3桁目に`&thinsp;`という文字参照があるので削除。
- div#portaldetails > table#resodetailsにレゾネータデプロイ状況が記載。
    - table#resodetails > tbody > tr要素が4つ（4行2列で表現される）。
    - tr内にtd, th, th, tdの順に要素が並ぶ。
    - tdはインストールしたエージェント名。
    - th > span.meterのtitle属性の文字列の中の"level:"と"owner:"の間にレゾネータレベルが記載（空白もあるのでトリムする）。レゾがないときはtitle属性の値がない（ここで処理を抜ける）。
    - div要素を含み、XMパーセンテージも記載されているので使いにくい→<del>th > span.meter > span.meter-levelの内容に「 L 8 」のように記載されているので、「L」を削除のうえトリムしてもレゾネータレベルを取得できる（レゾがないときはそもそもspan.meter-levelがない）。</del>
- div#portaldetails > div.linkdetails > aside[0]（内容が「Portal link」） > aのhref属性の値のうち&pll=から後ろがポータルID、と考えてよい（&ll=とは別なので注意）。

## ロジック（妄想）
- Exportリンクにイベントリスナー設定
- Exportリンククリック時(1)：div#portaldetailsの内容が空のときはなにもしないで処理終了。
- Exportリンククリック時(2)：キャッシュにポータル詳細を追記。
- Exportリンククリック時(3)：downloadリンクのhrefの内容をその都度アップデート。
- ポータル名取得
- ポータルレベル取得
- MODS状態取得
- レゾネータレベルと状況（空きスロットがあれば何かする）取得
- いろいろ計算のうえ、1行に収まるように整形
- downloadクリック時：IITCyyyymmddhhmm.txtとしてダウンロード（aタグdownload属性）
