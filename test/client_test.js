/*jshint browser:true*/
/*global describe, before, beforeEach, after, $, it, sinon, assert, expect */
describe('$.jsonp()', function(){
  function getOrigin(){
    var loc = window.location;
    return loc.origin || (loc.protocol + '//' + loc.host);
  }

  function getAjaxArgs(){
    return $.ajax.getCall(0).args[0];
  }


  var ajaxStub;
  before(function(){
    ajaxStub = sinon.stub($, 'ajax');
  });

  beforeEach(function(){
    ajaxStub.reset();
  });


  function sharedTests(){
    it('should do standard ajax for relative domains', function(){
      $.jsonp({
        url: '/foo'
      });

      expect(getAjaxArgs()).to.eql({url: '/foo'});
    });

    it('should do standard ajax for the same domain', function(){
      var url = getOrigin() + '/foo';

      $.jsonp({
        url: url
      });

      expect(getAjaxArgs()).to.eql({url: url});
    });
  }


  describe('with browser CORS support', function(){
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

      expect(getAjaxArgs()).to.eql({
        url: '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url)
      });
    });

    it('should use the URL directly if it supports CORS', function(){
      var url = 'http://foo.com/bar';

      $.jsonp({
        url: url,
        cors: true
      });

      expect(getAjaxArgs()).to.eql({url: url});
    });
  });


  describe('without browser CORS support', function(){
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

      expect(getAjaxArgs()).to.eql({
        url: '//jsonp.nodejitsu.com/?url=' + encodeURIComponent(url),
        dataType: 'jsonp'
      });
    });

    it('should use the URL directly if it supports JSONP', function(){
      var url = 'http://foo.com/bar';

      $.jsonp({
        url: url,
        jsonp: true
      });

      expect(getAjaxArgs()).to.eql({
        url: url,
        dataType: 'jsonp'
      });
    });
  });
});
