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
  $.ajaxPrefilter('jsonproxy', function(opts){
    var defaultDataType;
    // TODO don't assume 'jsonproxy' is first?
    opts.dataTypes.shift();

    if (opts.crossDomain){
      var doProxy = false,
        windowUrl = $.jsonp.getLocation(),
        params = URI.parseQuery(opts.data),
        apiUri = URI(opts.url).
          absoluteTo(windowUrl.href).
          addSearch(params);

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

    // workaround needed to have request handled properly
    if (!opts.dataTypes.length){
      opts.dataTypes.push(defaultDataType);
    }
    // delegate to the subsequent handler
    return opts.dataTypes[0];
  });

  $.jsonp = {
    PROXY: 'https://jsonp.nodejitsu.com/',

    // make this available for easier testing
    getLocation: function(){
      return window.location;
    },

    isInsecureRequest: function(uri){
      var windowUrl = this.getLocation();
      return windowUrl.protocol === 'https:' && uri.protocol() !== windowUrl.protocol;
    }
  };
}(jQuery));
