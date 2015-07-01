// ==UserScript==
// @name           Export Details for IITC
// @version        0.0.1
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
  //variables
  var cacheText = "";
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
        for (var i = 0; tmpStr.indexOf(needle) != -1; cnt++) {
          i = tmpStr.indexOf(needle);
          tmpStr = tmpStr.replace(needle, "");
        }
        var needed8r = 8 - cnt;
        return "@" + needed8r.toString();
      }
    };
    //#portaldetailsが存在しないか、中身が空ならexit
    var pd = jQ('#portaldetails') || false;
    if (pd) {
      if (pd.html()) {
        //ポータル名取得
        var portalName = jQ('h3.title', pd).text();
        //ポータルレベル取得
        var portalLv = jQ('div.imgpreview > span#level', pd).text();
        portalLv = "L" + portalLv.replace(/\s/g, "");
        //faction取得
        var faction = pd.attr('class').toUpperCase();
        //残りレゾネータ取得
        var needed8r = neededforLv8(jQ('#resodetails', pd), portalLv);
        //シールディング
        var shielding = "Shielding: " + jQ('#randdetails tbody tr:eq(2) td:eq(0)', pd).text();
        //AP
        var ap = "AP: " + jQ('#randdetails tbody tr:eq(3) td:eq(0)', pd).text().replace(/\s/g, "");
        //MODs
        var mods = getMods(pd);
        //取得日時
        var lastupdate = "last update: " + getDatetime();
        //テキスト整形
        cacheText = jQ('#cache').val() + portalName + ", " + portalLv + ", " + faction + ", " + needed8r + ", " + shielding + ", " + ap + ", " + mods + "\n";
        //", " + lastupdate +
        cache.text(cacheText);
        var mydata = 'data:application/octet-stream,' + encodeURIComponent(cacheText);
        jQ('a#downloadlink').attr('href', mydata);
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
      height: '170px',
      zIndex: '9997',
      backgroundColor: '#CCCCCC;'
    });
  ew.appendTo(document.body);
  //キャッシュの場所確保
  var cache = jQ('<textarea>', { id: 'cache'})
    .css({
      position: 'relative',
      width: '120px',
      height: '40px',
      fontSize: '0.8em'
    }).text(cacheText);
  cache.appendTo(ew);
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
