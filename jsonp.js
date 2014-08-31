/*
JSONProxy jQuery Plugin, v0.2.2
https://jsonp.nodejitsu.com

by Aidan Feldman
MIT license
*/
/*jshint browser:true */
/*global jQuery, URI */
(function($){
  // Accepts all jQuery.ajax() options, plus:
  //   corsSupport {Boolean} Set to true if the URL is known to support CORS for this domain.
  //   jsonpSupport {Boolean} Set to true if the URL is known to support JSONP.
  $.jsonp = function(opts){
    var windowUrl = $.jsonp.getLocation(),
      apiUri = URI(opts.url).absoluteTo(windowUrl.href),
      defaultDataType;

    if ($.jsonp.isCrossDomain(URI(windowUrl), apiUri)){
      var doProxy = false,
        params;

      if (typeof opts.data === 'string'){
        params = URI.parseQuery(opts.data);
      } else {
        params = opts.data || {};
      }
      apiUri.addSearch(params);

      // favor CORS because it can provide error messages from server to callbacks
      if ($.support.cors){
        // use the proxy if the endpoint doesn't support CORS, or if it would be an insecure request from a secure page
        if (!opts.corsSupport || $.jsonp.isInsecureRequest(apiUri)){
          // proxy CORS
          doProxy = true;
        } // else direct CORS
        defaultDataType = 'json';
      } else {
        if (!opts.jsonpSupport){
          // proxy JSONP
          doProxy = true;
        } // else direct JSONP

        defaultDataType = 'jsonp';
        opts.timeout = opts.timeout || 10000; // ensures error callbacks are fired
      }

      if (doProxy){
        opts.url = $.jsonp.PROXY;
        opts.data = $.param({
          url: apiUri.toString()
        });
      }
    } else {
      defaultDataType = 'json';
    }

    opts.dataType = defaultDataType;

    return $.ajax(opts);
  };

  $.extend($.jsonp, {
    PROXY: 'https://jsonp.nodejitsu.com/',

    // make this available for easier testing
    getLocation: function(){
      return window.location;
    },

    // http://stackoverflow.com/a/1084027/358804
    isCrossDomain: function(uri1, uri2){
      return (
        uri1.protocol() !== uri2.protocol() ||
        uri1.host() !== uri2.host() ||
        uri1.port() !== uri2.port()
      );
    },

    isInsecureRequest: function(uri){
      var windowUrl = this.getLocation();
      return windowUrl.protocol === 'https:' && uri.protocol() !== windowUrl.protocol;
    }
  });
}(jQuery));
