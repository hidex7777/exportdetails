# exportDetailsプラグインの試案

## 目的と動作、仕様
- ポータル詳細からワンクリックでローカルの（でなくてもいいが）テキストファイルに必要な情報（後述）を書き出す
- toolboxにExportリンクを表示
- ポータルが選択されていない状態のときはfunctionをexit
- ポータルが選択されている状態のときは、詳細情報を書き出す
- 書き出す際には、ポータルIDをチェックして、新しい情報でレコードを上書きする
- 新規書き出しのばあいは、新しいレコードを追加

## 必要な情報
- ポータル名
- どちらの陣営（RES||ENL）が所有しているか、または中立か
- 現レベル
- ［P8ならばスキップ］各レゾネータレベル
- ［P8ならばスキップ］入っているR8の数
- 8マイナスR8数であとR8がいくつでP8になるか（例：P8のとき「@0」R8が7本のとき「@1」）
- インストール済みMODの数・空きスロット数
- 各MODをチェックし、省略記号で書く
    - CPS
    - RPS
    - VRPS
    - AXA
    - CHS
    - RHS
    - VRHS
    - CMH
    - RMH
    - VRMH
    - TU
    - FA
    - LA
    - VRLA
    - none（空きスロット）
- 書き出し例：金透こみち, L7, RES, @1, CPS, CPS, TU, FA

## IITCの仕様（分かった部分だけ）
- div#toolboxにプラグイン用リンクを追記できる
- div#portaldetailsにポータル詳細が記載
- div#portaldetailsの内容が空のとき、ポータルが選択されていない
- div#portaldetailsのclass属性の値がenlのときENLポタ、resのときRESポタ、noneのとき中立
- div#portaldetails > h3.titleタグの内容がポータル名
- div#portaldetails > div.imgpreview > span#levelダグの内容がポータルレベル
- div#portaldetails > div.modsにMODSのインストール状況が記載
    - spanタグが4つ並ぶ＝例：RPSのとき「span title="Rare Portal Shield"」, MODが入っていないとき「title属性がなく、style属性」
- div#portaldetails > table#resodetailsにレゾネータデプロイ状況が記載
    - table#resodetails > tbody > tr要素が4つ（4行2列で表現される）
    - tr内にtd, th, td, thの順に要素が並ぶ
    - tdはインストールしたエージェント名
    - th > span.meterのtitle属性の文字列の中の"level:"と"owner:"の間にレゾネータレベルが記載（空白もあるのでトリムする）
    - th > span.meter > span.meter-levelの内容に「 L 8 」のように記載されているので、「L」を削除のうえトリムしてもレゾネータレベルを取得できる
- div#portaldetails > div.linkdetails > aside[0]（内容が「Portal link」） > aのhref属性の値のうち&pllから後ろがポータルID、と考えてよい（llとは別なので注意）

## ロジック（妄想）
- プラグイン用リンク（Export）をtoolboxに追記
    - もし、IITCが公式に認めているプラグイン以外がはねられるようなら、使っていないプラグインを書き換えて、無理やり入れる
- Exportリンクにイベントリスナー設定
- Exportリンククリック時(1)：とりまファイルクローズ
- Exportリンククリック時(2)：中立ポタ（none）ならなにもしないで終了
- Exportリンククリック時(3)：enlかresならファイルオープン（どのディレクトリにしますかね？）
- ポータル名取得
- ポータルレベル取得
- MODS状態取得
- レゾネータレベルと状況（空きスロットがあれば何かする）取得
- いろいろ計算のうえ、1行に収まるように整形
- オープンしたファイルをポータルIDで検索
    - IDがすでにあった：新規レコードで上書き
    - IDがなかった：新規レコードをファイル最後尾に追記
- ファイルクローズ

