/*
JSONProxy Client Library - WORK IN PROGRESS
http://jsonp.jit.su

by Aidan Feldman
MIT license
*/
/*jshint browser:true */
/*global jQuery */
(function($){
  // groups: protocol, slashes, host, path
  var regex = /^(?:(?:(?:((?:file|https?):))?(\/\/))?((?:[\w\-]\.?)+(?::\d+)?)?(\/\S*)?)$/i;

  // Accepts all jQuery.ajax() options, plus:
  //   cors {Boolean} Set to true if the URL is known to support CORS for this domain.
  //   jsonp {Boolean} Set to true if the URL is known to support JSONP.
  $.jsonp = function(opts){
    var loc = window.location,
      url = opts.url || loc.href, // jQuery.ajax() defaults to this
      match = url.match(regex), // not a valid URL unless matched
      host = match[3];

    // make a copy
    opts = $.extend({}, opts);

    if (host && host !== loc.host){
      // requesting to a different domain

      if (!(opts.cors && $.support.cors) && !opts.jsonp){
        // server doesn't have cross-domain support

        // construct absolute URL
        var protocol = match[1];
        if (!protocol){
          if (match[2]){
            // protocol-relative
            protocol = loc.protocol;
          } else {
            protocol = 'http:';
          }
        }
        url = protocol + '//' + host + match[4];

        // proxy the request
        url = '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url);
        opts.url = url;
      }

      if (!$.support.cors){
        // proxy via JSONP
        opts.dataType = 'jsonp';
      }
    }

    delete opts.cors;
    delete opts.jsonp;

    $.ajax(opts);
  };
}(jQuery));
