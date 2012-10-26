/*jshint browser:true*/
/*global describe, before, after, $, it, sinon, assert, expect */
describe('$.jsonp()', function(){
  function getOrigin(){
    var loc = window.location;
    return loc.origin || (loc.protocol + '//' + loc.host);
  }

  before(function(){
    sinon.stub($, 'ajax');  
  });


  function sharedTests(){
    it('should do standard ajax for relative domains', function(){
      $.jsonp({
        url: '/foo'
      });

      expect($.ajax.calledWithMatch({url: '/foo'})).to.be.ok();
    });

    it('should do standard ajax for the same domain', function(){
      var url = getOrigin() + '/foo';

      $.jsonp({
        url: url
      });

      expect($.ajax.calledWithMatch({url: url})).to.be.ok();
    });
  }


  describe('with CORS support', function(){
    var origCors;
    before(function(){
      origCors = $.support.cors;
      $.support.cors = true;
    });

    after(function(){
      $.support.cors = origCors;
    });


    sharedTests();

    it('should use the CORS proxy', function(){
      var url = 'http://foo.com/bar';

      $.jsonp({
        url: url
      });

      expect($.ajax.calledWithMatch({
        url: '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url)
      })).to.be.ok();
    });
  });


  describe('without CORS support', function(){
    var origCors;
    before(function(){
      origCors = $.support.cors;
      $.support.cors = false;
    });

    after(function(){
      $.support.cors = origCors;
    });


    sharedTests();

    it('should use the JSONP proxy', function(){
      var url = 'http://foo.com/bar';

      $.jsonp({
        url: url
      });

      expect($.ajax.calledWithMatch({
        url: '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url) + '&callback=?'
      })).to.be.ok();
    });
  });
});
