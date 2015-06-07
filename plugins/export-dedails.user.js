// ==UserScript==
// @id             iitc-plugin-export-details@export
// @name           IITC plugin: Export Details
// @category       Misc
// @version        0.0.1.@@DATETIMEVERSION@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Export info about Portals into local strage. Portal ID(pll), Portal name, level, MODs, Resonators, fuction, shielding, AP Gain.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

// PLUGIN START ////////////////////////////////////////////////////////
// use own namespace for plugin
window.plugin.exportdetails = function() {};


window.plugin.exportdetails.setupLink = function() {
  $('#toolbox').append('<a id="export-details-link">Export</a>');
}

// PLUGIN END //////////////////////////////////////////////////////////

