// ==UserScript==
// @name           Export Details for IITC
// @version        0.0.2
// @description    Export info about Portals into local strage. Portal ID(pll), Portal name, level, MODs, Resonators, fuction, shielding, AP Gain.
// @namespace      kojunkan.org
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

//jQuery読み込み
//$の代わりにjQを使う
var addJQuery = function(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
};

//main
//この中ではjQuery使える。$の代わりにjQ
var main = function() {
  //sessionStorageで使用するキーを"export-details"とする（SSKEY）。
  var SSKEY = "export-details";
  //ブラウザ起動時に初期化する。
  //sessionStorage.removeItem(SSKEY);
  //sessionStorageのvalueとして使うオブジェクトはひとつ（ssValue）。
  var ssValue = new Object();
  //オブジェクトssValueの中にオブジェクト（ハッシュ）を格納する。
  //格納するハッシュをクラス（プロトタイプ）としてあらかじめ定義しておく（Storage）。
  /*モデル
  sessionStorage{
    SSKEY: ssValue Object
  }
  //ssValueのなかにおいて、pllnnn....(key)は一意である。
  //既存のpll(key)のプロパティは上書きされる。
  ssValue{
    pll1nnn...:{
      portalname: String,
      portallv: String,
      faction: String,
      needed8r: String,
      shielding: String,
      ap: String,
      mods: String
    },
    pll2nnn...:{
      ......
    }
  }
  */
  //ひとつのポータルにひとつのStorageを割り当てる
  /*var Storage = new Object();
  var samp_pll = "pll37_401581__140_385654";
  var samp_data = {
    pll37_401581__140_385654:{
      portalname: "サンプルポータル",
      portallv: "L7",
      faction: "RES",
      needed8r: "@4",
      shielding: "Shielding: 2222",
      ap: "AP: 2525",
      mods: "CPS, CPS, AXA, AXA"
    }
  };*/
  /*
  function(key) {
    this.pll = key;
    this.pll.portalname = new String();
    this.pll.portallv = new String();
    this.pll.faction = new String();
    this.pll.needed8r = new String();
    this.pll.shielding = new String();
    this.pll.ap = new String();
    this.pll.mods = new String();
  };*/
  //sessionStorageのvalueとして使うオブジェクトはひとつ（ssValue）。
  //var ssValue = new Object();
  //旧バージョンの尻拭い
  //keyがpllで始まっているものをdelete, SSKEYも消す
  var removeOldcache = function() {
    sessionStorage.removeItem(SSKEY);
    for (var i = 0; i < sessionStorage.length; i++) {
      var key = sessionStorage.key(i);
      if (key.match(/^pll/)) {
        sessionStorage.removeItem(key);
      }
    }
  };
  removeOldcache();
  //sessionStorage.clear();
  //タイムスタンプ関数
  var styleDatetime = function(digits) {
    digits = digits.toString();
    if (/^[0-9]{1}$/.test(digits)) {
      digits = "0" + digits;
    }
    var twodigits = digits;
    return twodigits;
  };
  var getDatetime = function() {
    var dt = new Date();
    var y = dt.getFullYear().toString();
    var m = styleDatetime(dt.getMonth() + 1);
    var d = styleDatetime(dt.getDate());
    var h = styleDatetime(dt.getHours());
    var min = styleDatetime(dt.getMinutes());
    return y + m + d + h + min;
  };
  var setDatetime = function() {
    jQ('#downloadlink').attr('download', 'IITC' + getDatetime() + '.txt');
  };
  //キャシュアップデート関数
  var setCache = function() {
    //Mods取得と整形
    var getMods = function(context) {
      var modsarr = ["none", "none", "none", "none"];
      var moddiv = jQ('div.mods', context);
      for (var i = 0; i < 4; i++) {
        var mymod = jQ('span', moddiv).eq(i).text().toLowerCase();
        switch(mymod){
          case '' :
            modsarr[i] = "none";
            break;
          case 'common portal shield' :
            modsarr[i] = "CPS";
            break;
          case 'rare portal shield' :
            modsarr[i] = "RPS";
            break;
          case 'very rare portal shield' :
            modsarr[i] = "VRPS";
            break;
          case 'very rare axa shield' :
            modsarr[i] ="AXA";
            break;
          case 'common heat sink' :
            modsarr[i] = "CHS";
            break;
          case 'rare heat sink' :
            modsarr[i] = "RHS";
            break;
          case 'very rare heat sink' :
            modsarr[i] = "VRHS";
            break;
          case 'common multi-hack' :
            modsarr[i] = "CMH";
            break;
          case 'rare multi-hack' :
            modsarr[i] = "RMH";
            break;
          case 'very rare multi-hack' :
            modsarr[i] = "VRMH";
            break;
          case 'rare turret' :
            modsarr[i] = "TU";
            break;
          case 'rare force amp' :
            modsarr[i] = "FA";
            break;
          case 'rare link amp' :
            modsarr[i] = "LA";
            break;
          case 'very rare softbank ultra link' :
            modsarr[i] = "SBUL";
            break;
          default :
            modsarr[i] = mymod;
            break;
        }
      }
      return modsarr[0] + ", " + modsarr[1] + ", " + modsarr[2] + ", " + modsarr[3];
    };
    //残りレゾ計算
    var neededforLv8 = function(context, portalLv) {
      if (portalLv == "L8") {
        return "@0";
      } else if (portalLv == "L0") {
        return "@8";
      } else {
        var tmpStr = context.html();
        var needle = "level:\t8";
        var cnt = 0;
        for (var i = 0; i != -1; cnt++) {
          i = tmpStr.indexOf(needle);
          tmpStr = tmpStr.replace(needle, "");
        }
        var needed8r = 8 - cnt;
        return "@" + needed8r.toString();
      }
    };
    var getPll = function(context) {
      var href = jQ('.linkdetails aside:eq(0) a', context).attr('href');
      var rg = /pll=([0-9]+\.[0-9]+,[0-9]+\.[0-9]+)/;
      var result = rg.exec(href);
      var pllAsKey = RegExp.$1;
      pllAsKey = "pll" + pllAsKey.replace(/\./g,"_");
      pllAsKey = pllAsKey.replace(",", "__");
      return pllAsKey;
    };
    //ダウンロードリンクをssValueから生成
    var setTextEnc = function() {
     ssValue = sessionStorage.getItem(SSKEY);
     //テーブルのデータ key : mydata
     //値mydata ={}
     /*
      var mydata = {};
      mydata.portalname = new Object();
      mydata.portallv = new Object();
      mydata.faction = new Object();
      mydata.needed8r = new Object();
      mydata.shielding = new Object();
      mydata.ap = new Object();
      mydata.mods = new Object();
      var myHref = "";
      for (var i = 0; i < sessionStorage.length; i++) {
        var key = sessionStorage.key(i);
        console.log("key: " + key);
        var myvalue = sessionStorage.getItem(key);
        console.log(myvalue);
        if (!myvalue) {
          continue;
        }
        try {
          //Object型にする
          mydata = JSON.parse(myvalue);
        } catch (event) {
          console.log("e: " + event);
          continue;
        }
        var pll;
        for (pll in mydata) {
          myHref += mydata.portalname + ", " + mydata.portallv + ", " + mydata.faction + ", " + mydata.needed8r + ", " + mydata.mods + ", " + mydata.shielding + ", " + mydata.ap + "\n";  
        }
      }
      */
      var mydata = new Object();
      mydata = JSON.parse(ssValue);
      var myHref = "";
      var pll;
      for (pll in mydata) {
        myHref += mydata.portalname + ", " + mydata.portallv + ", " + mydata.faction + ", " + mydata.needed8r + ", " + mydata.mods + ", " + mydata.shielding + ", " + mydata.ap + "\n";  
      }
      myHref = 'data:application/octet-stream,' + encodeURIComponent(myHref);
      jQ('a#downloadlink').attr('href', myHref);
    };
    //setTextEnc終わり
    //Eボタンが押されたとき。sessionStorageに入れるところまで
    //ssValueが親Object、mydataが子オブジェクト
    //#portaldetailsが存在しないか、中身が空ならexit
    var pd = jQ('#portaldetails') || false;
    if (pd) {
      if (pd.html()) {
        //var mydata = {};
        //pll取得＝キーにする
        var pll = getPll(pd);
        //mydata[pll] = {};
        //ポータル名取得
        //mydata[pll].portalname = new Object();
        //mydata[pll].portalname = jQ('h3.title', pd).text();
        var portalname = jQ('h3.title', pd).text();
        //ポータルレベル取得
        //mydata[pll].portallv = new Object();
        var portallv = jQ('div.imgpreview > span#level', pd).text();
        //mydata[pll].portallv = "L" + portalLv.replace(/\s/g, "");
        portallv = "L" + portallv.replace(/\s/g, "");
        //faction取得
        //mydata[pll].faction = new Object();
        //mydata[pll].faction = pd.attr('class').toUpperCase();
        var faction = pd.attr('class').toUpperCase();
        //残りレゾネータ取得
        //mydata[pll].needed8r = new Object();
        //mydata[pll].needed8r = neededforLv8(jQ('#resodetails', pd), mydata[pll].portallv);
        var needed8r = neededforLv8(jQ('#resodetails', pd), portallv);
        //シールディング
        //mydata[pll].shielding = new Object();
        //mydata[pll].shielding = "Shielding: " + jQ('#randdetails tbody tr:eq(2) td:eq(0)', pd).text();
        shielding = "Shielding: " + jQ('#randdetails tbody tr:eq(2) td:eq(0)', pd).text();
        //AP
        //mydata[pll].ap = new Object();
        //mydata[pll].ap = "AP: " + jQ('#randdetails tbody tr:eq(3) td:eq(0)', pd).text().replace(/\s/g, "");
        var ap = "AP: " + jQ('#randdetails tbody tr:eq(3) td:eq(0)', pd).text().replace(/\s/g, "");
        //MODs
        //mydata[pll].mods = new Object();
        //mydata[pll].mods = getMods(pd);
        var mods = getMods(pd);
        //取得日時
        //var lastupdate = "last update: " + getDatetime();
        //子オブジェクト作成
        var mydata = {
          "portalname": portalname,
          "portallv": portallv,
          "faction": faction,
          "needed8r": needed8r,
          "shielding": shielding,
          "ap": ap,
          "mods": mods
        };
        //親オブジェクトに代入
        ssValue = sessionStorage.getItem(SSKEY);
        ssValue[pll] = mydata;
        //テキスト整形
        //Object型をJSON形式に変換
        var myJson = JSON.stringify(ssValue);
        //セッションストレージへ格納（key: SSKEY, value: ssValue）
        //sessionStorage.setItem(pll, ssValue);
        sessionStorage.setItem(SSKEY, myJson);
        //テキスト用エンコード
        setTextEnc();
      }
    }
  };
  //setCache終わり
  //wrapper　ここからベタ書き
  var ew = jQ('<div>', { id: 'edWrapper'})
    .css({
      position: 'fixed',
      bottom: '10px',
      right: '0px',
      width: '120px',
      height: '130px',
      zIndex: '9997',
      backgroundColor: '#CCCCCC;'
    });
  ew.appendTo(document.body);
  //E-button
  jQ('<div>', {id: 'exportdetails', text: 'E'})
    .css({
      position: 'relative',
      backgroundColor: '#004F4A',
      width: '70px',
      height: '70px',
      margin: '0 auto',
      fontSize: '4em',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#47D9CB',
      zIndex: '9998',
      borderRadius: '50%',
      cursor: 'pointer'
    }).click(function(){
      setDatetime();
      setCache();
    }).appendTo(ew);
  //link wrapper
  var dlb = jQ('<div>', {id: 'downloadlinkBox'})
    .css({
      position: 'relative',
      margin: '0 auto',
      width: '70px',
      textAlign: 'center',
      zIndex: '9999'
    });
  dlb.appendTo(ew);
  //download link
  var dl = jQ('<a>', {id: 'downloadlink', text: 'download', download: 'IITC' + getDatetime() + '.txt', target: '_blank'})
    .css({
      fontSize: '1em',
      textAlign: 'center',
      color: '#47D9CB',
      cursor: 'pointer'
    });
  dl.appendTo(dlb);
  //Data URI Scheme
  dl.attr('href', 'data:text/plain;base64,dGVzdA==');
};

//load jQuery and execute main function
addJQuery(main);
