/*
JSONProxy Client Library
http://jsonp.jit.su

by Aidan Feldman
MIT license
*/
/*global jQuery:true*/
(function($){
  $.jsonp = function(opts){
     $.ajax(opts);
  };
}(jQuery));
