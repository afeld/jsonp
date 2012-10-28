/*
JSONProxy Client Library - WORK IN PROGRESS
http://jsonp.jit.su

by Aidan Feldman
MIT license
*/
/*jshint browser:true */
/*global jQuery */
(function($){
  // groups: protocol, host, path
  var regex = /^(?:(?:(?:((?:file|https?):))?\/\/)?((?:[\w\-]\.?)+(?::\d+)?)?(\/\S*)?)$/i;

  function proxyUrl(url){
    return '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url);
  }

  // Accepts all jQuery.ajax() options, plus:
  //   cors {Boolean} Set to true if the URL is known to support CORS for this domain.
  //   jsonp {Boolean} Set to true if the URL is known to support JSONP.
  $.jsonp = function(opts){
    var loc = window.location,
      url = opts.url || loc.href, // jQuery.ajax() defaults to this
      match = url.match(regex), // not a valid URL unless matched
      protocol = match[1] || loc.protocol,
      host = match[2] || loc.host,
      dataType = opts.dataType;

    // make a copy
    opts = $.extend({}, opts);

    if (protocol !== loc.protocol || host !== loc.host){
      // requesting to a different domain

      // construct absolute URL
      var path = match[3] || '';
      url = protocol + '//' + host + path;

      // favor CORS because it can provide error messages from server to callbacks
      if ($.support.cors){
        if (!opts.cors){
          // proxy CORS
          url = proxyUrl(url);
        } // else direct CORS
      } else {
        dataType = 'jsonp';
        if (!opts.jsonp){
          // proxy JSONP
          url = proxyUrl(url);
        } // else direct JSONP
      }
    }

    if (dataType === 'jsonp'){
      opts.timeout = opts.timeout || 10000; // ensures error callbacks are fired
    }

    opts.dataType = dataType || 'json';
    opts.url = url;

    delete opts.cors;
    delete opts.jsonp;

    return $.ajax(opts);
  };
}(jQuery));
