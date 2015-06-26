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
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}


//main
function main() {
  //dialog
  var dialog = function(title) {
    alert(
      title +
      "\n ダミーデータだよ。US15 AXA33 SB1 HS4 MH2(sum55)"
    );
  };
  jQ('<div>', {id: 'exportdetails', text: 'E'})
    .css({
      position: 'absolute',
      fontSize: '3em',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#47D9CB',
      zIndex: '9999'
    })
    .appendTo('<div>', { id: 'edWrapper'})
      .css({
        position: 'fixed',
        bottom: '50px',
        right: '50px',
        width: '70px',
        height: '70px',
        backgroundColor: '#004F4A',
        zIndex: '9998',
        borderRadius: '50%'
      })
      .click(function(){
        dialog('Export Details');
      })
      .appendTo('body');
}

//load jQuery and execute main function
addJQuery(main);
