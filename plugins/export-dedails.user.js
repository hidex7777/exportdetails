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
  //$の代わりにjQを使う
  jQ('body').append(jQ('<div>')
    .css({
      position: 'fixed',
      bottom: '50px',
      right: '50px',
      width: '70px',
      height: '70px',
      backgroundColor: '#004F4A',
      zIndex: '9999',
      borderRadius: '50%'
    })
    .append(jQ('<div>', { text: 'E'})
      .css({
        fontSize: '3em',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#47D9CB'
      })
    )
  );
}

//load jQuery and execute main function
addJQuery(main);
