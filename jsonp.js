/*
JSONProxy jQuery Plugin, v0.1.0
http://jsonp.jit.su

by Aidan Feldman
MIT license
*/
/*jshint browser:true */
/*global jQuery */
(function($){
  // groups: protocol, host, path
  var regex = /^(?:(?:(?:((?:file|https?):))?\/\/)?((?:[\w\-]\.?)+(?::\d+)?)?(\/\S*)?)$/i;

  function proxyUrl(url, raw){
    url = '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url);
    if (raw){
      url += '&raw=true';
    }
    return url;
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
      dataType = opts.dataType,
      raw = dataType === 'text';

    // make a copy
    opts = $.extend({}, opts);

    if (protocol !== loc.protocol || host !== loc.host){
      // requesting to a different domain

      // construct absolute URL
      var path = match[3] || '';
      url = protocol + '//' + host + path;

      // favor CORS because it can provide error messages from server to callbacks
      if ($.support.cors){
        if (!opts.corsSupport){
          // proxy CORS
          opts.url = proxyUrl(url, raw);
        } // else direct CORS
      } else {
        if (!opts.jsonpSupport){
          // proxy JSONP
          opts.url = proxyUrl(url, raw);

          var success = opts.success;
          if (raw && success){
            // jQuery(?) doesn't accept JSONP responses with strings passed, so raw responses are wrapped with {data: "..."}.
            // Mask this to the library user by simply returning the underlying string.
            opts.success = function(json){
              // jQuery will take care of setting the proper context
              success.call(opts.context || this, json.data);
            };
          }
        } // else direct JSONP
        dataType = 'jsonp';
      }
    }

    if (dataType === 'jsonp'){
      opts.timeout = opts.timeout || 10000; // ensures error callbacks are fired
    }
    opts.dataType = dataType || 'json';

    return $.ajax(opts);
  };
}(jQuery));
