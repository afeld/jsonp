/*
JSONProxy Client Library
http://jsonp.jit.su

by Aidan Feldman
MIT license
*/
/*global jQuery:true*/
(function($){
  // groups: protocol, slashes, host, path
  var regex = /^(?:(?:(?:(https?:))?(\/\/))?((?:[\w\-]\.?)+(?::\d+)?)?(\/\S*)?)$/i;

  $.jsonp = function(opts){
    // make a copy
    opts = $.extend({}, opts);

    var url = opts.url,
      match = url.match(regex), // not a valid URL unless matched
      protocol = match[1],
      host = match[3],
      loc = window.location;

    if (!protocol){
      if (match[2]){
        // protocol-relative
        protocol = loc.protocol;
      } else {
        protocol = 'http:';
      }
    }

    if (!host){
      host = loc.host;
    }

    if (protocol === loc.protocol && host === loc.host){
      // same domain
    } else {
      // needs proxying

      // construct absolute URL
      url = protocol + '//' + host + match[4];
      url = '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url);

      if (!$.support.cors){
        // proxy via JSONP
        url += '&callback=?';
      }

      opts.url = url;
    }

    $.ajax(opts);
  };
}(jQuery));
