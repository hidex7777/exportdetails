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
function main() {
  //cache
  //dialog
  var dialog = function(title) {
    alert(
      title +
      "\n ダミーデータだよ。US15 AXA33 SB1 HS4 MH2(sum55)"
    );
  };
  //wrapper
  jQ('<div>', { id: 'edWrapper'})
    .css({
      position: 'fixed',
      bottom: '50px',
      right: '50px',
      width: '70px',
      height: '100px',
      zIndex: '9997',
    })
    .appendTo('body');
    //E-button
    jQ('<div>', {id: 'exportdetails', text: 'E'})
      .css({
        position: 'relative',
        backgroundColor: '#004F4A',
        width: '70px',
        height: '70px',
        fontSize: '4em',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#47D9CB',
        zIndex: '9998',
        borderRadius: '50%',
        cursor: 'pointer'
      }).click(function(){
        dialog('Export Details');
      }).appendTo('div#edWrapper');
    //link wrapper
    jQ('<div>', {id: 'downloadlinkBox'})
      .css({
        position: 'relative',
        width: '70px',
        zIndex: '9999'
      }).appendTo('div#edWrapper');
    jQ('<a>', {id: 'downloadlink', text: 'download', download: 'log.txt', target: '_blank'})
      .css({
        fontSize: '1em',
        textAlign: 'center',
        color: '#47D9CB',
        cursor: 'pointer'
      }).appendTo('div#downloadlinkBox');
  //Data URI Scheme
  jQ('#downloadlink').attr('href', 'data:text/plain;base64,dGVzdA==');
}

//load jQuery and execute main function
//Cu.importGlobalProperties(['Blob']);
addJQuery(main);
