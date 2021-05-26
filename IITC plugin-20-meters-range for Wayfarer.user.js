// ==UserScript==
// @id             iitc-plugin-wayfarer@Lin
// @name           IITC plugin: 20-meters-range for Wayfarer
// @category       Layer
// @version        0.1.2
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      https://static.iitc.me/build/release/plugins/zaprange.meta.js
// @downloadURL    https://static.iitc.me/build/release/plugins/zaprange.user.js
// @description    Shows the 20-meters-range of Portals.
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'iitc';
plugin_info.dateTimeVersion = '20170108.21732';
plugin_info.pluginId = 'wayfarer_range';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ///////////////////////////////////////////////////////

  // use own namespace for plugin
  window.plugin.wayfarer_range = function() {};
  window.plugin.wayfarer_range.wayfarer_layers = {};
  window.plugin.wayfarer_range.MIN_MAP_ZOOM = 17;

  window.plugin.wayfarer_range.portalAdded = function(data) {
    data.portal.on('add', function() {
      window.plugin.wayfarer_range.draw(this.options.guid, this.options.team);
    });

    data.portal.on('remove', function() {
      window.plugin.wayfarer_range.remove(this.options.guid, this.options.team);
    });
  }

  window.plugin.wayfarer_range.remove = function(guid, faction) {
    var previousLayer = window.plugin.wayfarer_range.wayfarer_layers[guid];

  }

    // customize the circles
  window.plugin.wayfarer_range.draw = function(guid, faction) {
    var d = window.portals[guid];
      var coo = d._latlng;
      var latlng = new L.LatLng(coo.lat,coo.lng);
      var optCircle = {color:'red',opacity:0.7,fillColor:'red',fillOpacity:0.1,weight:1,interactive:false, dashArray: [10,6]};
      var range = 20;
      var circle = new L.Circle(latlng, range, optCircle);
      circle.addTo(window.plugin.wayfarer_range.wayfarer_circle_group);
      window.plugin.wayfarer_range.wayfarer_layers[guid] = circle;
  }

  window.plugin.wayfarer_range.showOrHide = function() {
    if(map.getZoom() >= window.plugin.wayfarer_range.MIN_MAP_ZOOM) {
      // show the layer
      if(!window.plugin.wayfarer_range.wayfarer_layer_group.hasLayer(window.plugin.wayfarer_range.wayfarer_circle_group)) {
        window.plugin.wayfarer_range.wayfarer_layer_group.addLayer(window.plugin.wayfarer_range.wayfarer_circle_group);
        $('.leaflet-control-layers-list span:contains("20m range")').parent('label').removeClass('disabled').attr('title', '');
      }
    } else {
      // hide the layer
      if(window.plugin.wayfarer_range.wayfarer_layer_group.hasLayer(window.plugin.wayfarer_range.wayfarer_circle_group)) {
        window.plugin.wayfarer_range.wayfarer_layer_group.removeLayer(window.plugin.wayfarer_range.wayfarer_circle_group);
        $('.leaflet-control-layers-list span:contains("20m range")').parent('label').addClass('disabled').attr('title', 'Zoom in to show those.');
      }
    }
  }

  var setup =  function() {
    // this layer is added to the layer chooser, to be toggled on/off
    window.plugin.wayfarer_range.wayfarer_layer_group = new L.LayerGroup();

    // this layer is added into the above layer, and removed from it when we zoom out too far
    window.plugin.wayfarer_range.wayfarer_circle_group = new L.LayerGroup();

    window.plugin.wayfarer_range.wayfarer_layer_group.addLayer(window.plugin.wayfarer_range.wayfarer_circle_group);

    window.addLayerGroup('20m range', window.plugin.wayfarer_range.wayfarer_layer_group, true);

    window.addHook('portalAdded', window.plugin.wayfarer_range.portalAdded);

    map.on('zoomend', window.plugin.wayfarer_range.showOrHide);

    window.plugin.wayfarer_range.showOrHide();
  }

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);


