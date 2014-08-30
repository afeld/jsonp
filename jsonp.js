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


  var Url = function(str, paramStr){
    var loc = $.jsonp.getLocation(),
      match = str.match(regex); // not a valid URL unless matched

    this.href = str;
    this.protocol = match[1] || loc.protocol;
    this.host = match[2] || loc.host;
    this.path = match[3] || '';
    this.paramStr = paramStr;
  };

  // returns absolute URL
  Url.prototype.toString = function(){
    var urlStr = this.protocol + '//' + this.host + this.path;
    if (this.paramStr){
      // add params to URL being passed
      if (/\?/.test(this.path)){
        urlStr += '&';
      } else {
        // no existing query params
        if (!this.path) {
          urlStr += '/';
        }
        urlStr += '?';
      }
      urlStr += this.paramStr;
    }
    return urlStr;
  };


  // Accepts all jQuery.ajax() options, plus:
  //   corsSupport {Boolean} Set to true if the URL is known to support CORS for this domain.
  //   jsonpSupport {Boolean} Set to true if the URL is known to support JSONP.
  $.ajaxPrefilter('jsonproxy', function(opts){
    var windowUrl = $.jsonp.getLocation(),
      apiUrl;

    if (opts.url){
      apiUrl = new Url(opts.url, opts.data);
    } else {
      // jQuery.ajax() defaults to this
      apiUrl = windowUrl;
    }

    if (opts.crossDomain){
      var doProxy = false;
      // favor CORS because it can provide error messages from server to callbacks
      if ($.support.cors){
        // use the proxy if the endpoint doesn't support CORS, or if it would be an insecure request from a secure page
        if (!opts.corsSupport || (windowUrl.protocol === 'https:' && apiUrl.protocol !== windowUrl.protocol)){
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

        opts.data = $.param({
          url: apiUrl.toString()
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
