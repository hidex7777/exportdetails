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
  jQ('<div>', {id: 'exportdetails', text: 'E'})
    .css({
      position: 'absolute',
      fontSize: '4em',
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
        borderRadius: '50%',
        cursor: 'pointer'
      })
      .click(function(){
        dialog('Export Details');
      })
      .appendTo('body');
  //FileSystem
  ////errorHandler
  var errorHandler = function(e) {
    var msg ='';
    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = "NOT_FOUND_ERR";
        break;
      case FileError.SECURITY_ERR:
        msg = "SECURITY_ERR";
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = "INVALID_MODIFICATION_ERR";
        break;
      default:
      msg = 'Unknown Error';
      break;
    }
    console.log('Error: ' + msg);
  };
  var onInitFs = function(fs) {
    fs.root.getFile('log.txt', {create: true}, function(fileEntry) {
      //create FileWriter
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
          console.log('Write completed.');
        };
        fileWriter.onerror = function(e) {
          console.log('Write failed: ' + e.toString());
        };
        //create Blob
        var fp = ['Lorem Ipsum'];
        var bb = new Blob(fp, {type: 'text/plain'});
        //bb.append('Lorem Ipsum');
        //fileWriter.write(bb.getBlob('text/plain'));
        fileWriter.write(bb);
      }, errorHandler);
    }, errorHandler);
  };
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
  window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
}

//load jQuery and execute main function
//Cu.importGlobalProperties(['Blob']);
addJQuery(main);
