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
      host = match[3];

    // make a copy
    opts = $.extend({}, opts);

    var protocol = match[1];
    if (!protocol){
      if (match[2]){
        // protocol-relative
        protocol = loc.protocol;
      } else {
        protocol = 'http:';
      }
    }

    // construct absolute URL
    url = protocol + '//' + host + match[4];

    if (host && host !== loc.host){
      // requesting to a different domain

      if ($.support.cors){
        if (!opts.cors){
          // proxy CORS
          opts.url = proxyUrl(url);
        } // else direct CORS
      } else {
        opts.dataType = 'jsonp';
        if (!opts.jsonp){
          // proxy JSONP
          opts.url = proxyUrl(url);
        } // else direct JSONP
      }
    }

    delete opts.cors;
    delete opts.jsonp;

    return $.ajax(opts);
  };
}(jQuery));
