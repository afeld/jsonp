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
    // make a copy
    opts = $.extend({}, opts);

    var url = opts.url || window.location.href, // jQuery.ajax() defaults to this
      match = url.match(regex), // not a valid URL unless matched
      protocol = match[1],
      host = match[3],
      loc = window.location;

    if (host && host !== loc.host){
      // requesting to a different domain

      if (!protocol){
        if (match[2]){
          // protocol-relative
          protocol = loc.protocol;
        } else {
          protocol = 'http:';
        }
      }

      if (!(opts.cors && $.support.cors) && !opts.jsonp){
        // server doesn't have cross-domain support

        // construct absolute URL
        url = protocol + '//' + host + match[4];
        // proxy the request
        url = '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url);
      }

      if (!$.support.cors){
        // proxy via JSONP
        opts.dataType = 'jsonp';
      }

      delete opts.cors;
      delete opts.jsonp;
      opts.url = url;
    }

    $.ajax(opts);
  };
}(jQuery));
