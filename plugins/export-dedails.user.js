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
  var ssValue = {};

  //旧バージョンの尻拭い
  //keyがpllで始まっているものをdelete, 0.0.3以降のSSKEYも消す
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
  /*
  setCache関数
  Eボタンを押下すると、この関数が呼び出される
  */
  var setCache = function() {
    //Mods取得と整形
    var getMods = function(context) {
      var mods = "";
      var moddiv = jQ('div.mods', context);
      for (var i = 0; i < 4; i++) {
        var mymod = jQ('span', moddiv).eq(i).text().toLowerCase();
        switch(mymod){
          case '' :
            mods += "/none";
            break;
          case 'common portal shield' :
            mods += "/CPS";
            break;
          case 'rare portal shield' :
            mods += "/RPS";
            break;
          case 'very rare portal shield' :
            mods += "/VRPS";
            break;
          case 'very rare axa shield' :
            mods +="/AXA";
            break;
          case 'common heat sink' :
            mods += "/CHS";
            break;
          case 'rare heat sink' :
            mods += "/RHS";
            break;
          case 'very rare heat sink' :
            mods += "/VRHS";
            break;
          case 'common multi-hack' :
            mods += "/CMH";
            break;
          case 'rare multi-hack' :
            mods += "/RMH";
            break;
          case 'very rare multi-hack' :
            mods += "/VRMH";
            break;
          case 'rare turret' :
            mods += "/TU";
            break;
          case 'rare force amp' :
            mods += "/FA";
            break;
          case 'rare link amp' :
            mods += "/LA";
            break;
          case 'very rare softbank ultra link' :
            mods += "/SBUL";
            break;
          default :
            mods += "/" + mymod;
            break;
        }
      }
      return mods.replace(/^\//, "");
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
      //sessionStorageのデータをObject型に変換
      var mydata = new Object();
      mydata = JSON.parse(ssValue);
      var myHref = "";
      for (var pll in mydata) {
        myHref += mydata[pll].portalname + ", " + mydata[pll].portallv + ", " + mydata[pll].faction + ", " + mydata[pll].needed8r + ", " + mydata[pll].mods + ", " + mydata[pll].shielding + ", " + mydata[pll].ap + "\n";
      }
      myHref = 'data:application/octet-stream,' + encodeURIComponent(myHref);
      jQ('a#downloadlink').attr('href', myHref);
    };
    //setTextEnc終わり
    //Eボタンが押されたとき。sessionStorageに入れるところまで
    //ssValueが親Object（キーはexport-details）、mydataが子オブジェクト（キーはpll...）
    //#portaldetailsが存在しないか、中身が空ならexit
    var pd = jQ('#portaldetails') || false;
    if (pd) {
      if (pd.html()) {
        ssValue = sessionStorage.getItem(SSKEY) ? sessionStorage.getItem(SSKEY) :{};
        var pll = "";
        pll = getPll(pd);
        console.log("pll: " + pll);
        //ポータル名取得
        var portalname = jQ('h3.title', pd).text();
        //ポータルレベル取得
        var portallv = jQ('div.imgpreview > span#level', pd).text();
        portallv = "L" + portallv.replace(/\s/g, "");
        //faction取得
        var faction = pd.attr('class').toUpperCase();
        //残りレゾネータ取得
        var needed8r = neededforLv8(jQ('#resodetails', pd), portallv);
        //シールディング
        var shielding = "Shielding: " + jQ('#randdetails tbody tr:eq(2) td:eq(0)', pd).text();
        //AP
        var ap = "AP: " + jQ('#randdetails tbody tr:eq(3) td:eq(0)', pd).text().replace(/\s/g, "");
        //MODs
        var mods = getMods(pd);
        //取得日時
        //var lastupdate = "last update: " + getDatetime();
        //親オブジェクトに代入
        ssValue[pll] = {
          "portalname": portalname,
          "portallv": portallv,
          "faction": faction,
          "needed8r": needed8r,
          "shielding": shielding,
          "ap": ap,
          "mods": mods
        };
        //テキスト整形
        //Object型をJSON形式に変換
        var myJson = JSON.stringify(ssValue);
        console.log(ssValue);
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
