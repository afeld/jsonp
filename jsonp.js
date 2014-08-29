/*
JSONProxy jQuery Plugin, v0.2.2
https://jsonp.nodejitsu.com

by Aidan Feldman
MIT license
*/
/*jshint browser:true */
/*global jQuery */
(function($){
  // groups: protocol, host, path
  var regex = /^(?:(?:(?:((?:file|https?):))?\/\/)?((?:[\w\-]\.?)+(?::\d+)?)?(\/\S*)?)$/i,
    PROXY = 'https://jsonp.nodejitsu.com/';

  // Accepts all jQuery.ajax() options, plus:
  //   corsSupport {Boolean} Set to true if the URL is known to support CORS for this domain.
  //   jsonpSupport {Boolean} Set to true if the URL is known to support JSONP.
  $.ajaxPrefilter('jsonproxy', function(opts){
    var loc = $.jsonp.getLocation(),
      url = opts.url || loc.href, // jQuery.ajax() defaults to this
      match = url.match(regex), // not a valid URL unless matched
      windowProtocol = loc.protocol,
      protocol = match[1] || windowProtocol,
      host = match[2] || loc.host;

    if (opts.crossDomain){
      // construct absolute URL
      var path = match[3] || '';
      url = protocol + '//' + host + path;

      var doProxy = false;
      // favor CORS because it can provide error messages from server to callbacks
      if ($.support.cors){
        // use the proxy if the endpoint doesn't support CORS, or if it would be an insecure request from a secure page
        if (!opts.corsSupport || (windowProtocol === 'https:' && protocol !== windowProtocol)){
          // proxy CORS
          doProxy = true;
        } // else direct CORS
        opts.dataType = 'json';
      } else {
        if (!opts.jsonpSupport){
          // proxy JSONP
          doProxy = true;
        } // else direct JSONP

        opts.dataType = 'jsonp';
        opts.timeout = opts.timeout || 10000; // ensures error callbacks are fired
      }

      if (doProxy){
        opts.url = PROXY;

        if (opts.data){
          if (/\?/.test(url)){
            url += '&';
          } else {
            // no existing query params
            if (!path) {
              url += '/';
            }
            url += '?';
          }
          url += opts.data;
        }

        opts.data = $.param({
          url: url
        });
      }
    } else {
      opts.dataType = 'json';
    }

    // delegate to the respective handler
    return opts.dataType;
  });

  $.jsonp = {
    // make this available for easier testing
    getLocation: function(){
      return window.location;
    }
  };
}(jQuery));
