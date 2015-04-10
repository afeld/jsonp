/*
JSONProxy jQuery Plugin, v0.3.0
https://jsonp.afeld.me

by Aidan Feldman
MIT license
*/
/*jshint browser:true */
/*global define, jQuery, URI */
(function(factory){
  // https://github.com/umdjs/umd/blob/ce6c20e318e58cd301ee929135cf651b02392c08/jqueryPlugin.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'jquery',
      // https://github.com/medialize/URI.js#requirejs
      'URIjs/URI'
    ], factory);
  } else {
    // Browser globals
    factory(jQuery, URI);
  }
}(function($, URI) {
  // Accepts all jQuery.ajax() options, plus:
  //   corsSupport {Boolean} Set to true if the URL is known to support CORS for this domain.
  //   jsonpSupport {Boolean} Set to true if the URL is known to support JSONP.
  $.jsonp = function(opts){
    var windowUrl = $.jsonp.getLocation(),
      apiUri = $.jsonp.getApiUri(opts),
      defaultDataType;

    if ($.jsonp.isCrossDomain(URI(windowUrl), apiUri)){
      var doProxy;

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
        opts.data = {
          url: apiUri.toString()
        };

        if (opts.dataType === 'text'){
          // 'raw' request

          // jQuery(?) doesn't accept JSONP responses with strings passed, so raw responses are wrapped with {data: "..."}.
          // Mask this to the library user by simply returning the underlying string.
          opts.dataFilter = function(json){
            return json.data;
          };
          opts.data.raw = true;
        }

        opts.url = $.jsonp.PROXY;
        opts.dataType = defaultDataType;
      }
    } else {
      defaultDataType = 'json';
    }

    opts.dataType = opts.dataType || defaultDataType;

    return $.ajax(opts);
  };

  $.extend($.jsonp, {
    PROXY: 'https://jsonp.afeld.me/',

    // make this available for easier testing
    getLocation: function(){
      return window.location;
    },

    getApiUri: function(ajaxOpts){
      var windowUrl = $.jsonp.getLocation(),
        uri = URI(ajaxOpts.url).absoluteTo(windowUrl.href),
        params;

      if (typeof ajaxOpts.data === 'string'){
        params = URI.parseQuery(ajaxOpts.data);
      } else {
        params = ajaxOpts.data || {};
      }
      uri.addSearch(params);

      return uri;
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
}));
