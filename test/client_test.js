/*jshint browser:true*/
/*global describe, before, beforeEach, after, $, it, sinon, assert, expect */
describe('$.jsonp()', function(){
  var loc = window.location,
    protocol = loc.protocol,
    origin = loc.origin || (loc.protocol + '//' + loc.host),
    proxy = protocol + '//jsonp.nodejitsu.com/',
    packagePath = loc.pathname.replace(/test.html/, 'package.json');


  function sharedTests(){
    it('should do standard ajax for relative domains', function(done){
      $.jsonp({
        url: packagePath,

        beforeSend: function(_, settings){
          expect(settings.url).to.be(packagePath);
        }
      }).done(function(data){
        expect(data.name).to.equal('jsonp');
        done();
      });
    });

    it('should do standard ajax for the same domain', function(done){
      var url = origin + packagePath;

      $.jsonp({
        url: url,

        beforeSend: function(_, settings){
          expect(settings.url).to.be(url);
        }
      }).done(function(data){
        expect(data.name).to.equal('jsonp');
        done();
      });
    });

    it('should use the proxy for a mismatched protocol', function(done){
      var otherProtocol = protocol === 'https:' ? 'http:' : 'https:',
        url = otherProtocol + '//' + loc.host + '/bar';

      $.jsonp({
        url: url,

        beforeSend: function(_, settings){
          expect(settings.url).to.contain(proxy + '?url=' + encodeURIComponent(url)); // + '&callback=jQuery...' for JSONP

          done();
          return false;
        }
      });
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

    it('should use the CORS proxy', function(done){
      var url = 'http://foo.com/bar';

      $.jsonp({
        url: url,

        beforeSend: function(_, settings){
          expect(settings.url).to.be(proxy + '?url=' + encodeURIComponent(url));

          done();
          return false;
        }
      });
    });

    it('should use CORS proxy even if the URL supports JSONP', function(done){
      var url = 'http://foo.com/bar';

      $.jsonp({
        url: url,
        jsonpSupport: true,

        beforeSend: function(_, settings){
          expect(settings.url).to.be(proxy + '?url=' + encodeURIComponent(url));

          done();
          return false;
        }
      });
    });

    it('should handle requests for text to relative path', function(done){
      var url = loc.pathname.replace(/test.html/, 'test/data.txt');

      $.jsonp({
        url: url,
        dataType: 'text',

        beforeSend: function(_, settings){
          expect(settings.url).to.be(url);
        }
      }).done(function(text){
        expect(text).to.equal('hello world');
        done();
      });
    });

    it('should handle requests for text across domains', function(done){
      var url = 'http://foo.com/data.txt';

      $.jsonp({
        url: url,
        dataType: 'text',

        beforeSend: function(_, settings){
          expect(settings.url).to.be(proxy + '?url=' + encodeURIComponent(url) + '&raw=true');
          expect(settings.dataType).to.be('text');

          done();
          return false;
        }
      });
    });

    describe('when API has corsSupport', function(){
      it('should use the URL directly', function(done){
        var url = 'http://foo.com/bar';

        $.jsonp({
          url: url,
          corsSupport: true,

          beforeSend: function(_, settings){
            expect(settings.url).to.be(url);

            done();
            return false;
          }
        });
      });

      it('should favor CORS to JSONP on the URL directly', function(done){
        var url = 'http://foo.com/bar';

        $.jsonp({
          url: url,
          corsSupport: true,
          jsonpSupport: true,

          beforeSend: function(_, settings){
            expect(settings.url).to.be(url);

            done();
            return false;
          }
        });
      });
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

    it('should use the JSONP proxy', function(done){
      var url = 'http://foo.com/bar';

      $.jsonp({
        url: url,

        beforeSend: function(_, settings){
          expect(settings.url).to.contain(proxy + '?url=' + encodeURIComponent(url) + '&callback=jQuery');
          // should set default timeout
          expect(settings.timeout).to.be.a('number');

          done();
          return false;
        }
      });
    });

    it('should handle requests for text across domains', function(done){
      var url = 'http://foo.com/data.txt';

      $.jsonp({
        url: url,
        dataType: 'text',

        beforeSend: function(_, settings){
          expect(settings.url).to.contain('&raw=true&');
          expect(settings.dataType).to.be('jsonp');

          done();
          return false;
        }
      });
    });

    describe('when API has jsonpSupport', function(){
      it('should use the URL directly', function(done){
        var url = 'http://foo.com/bar';

        $.jsonp({
          url: url,
          jsonpSupport: true,

          beforeSend: function(_, settings){
            expect(settings.url).to.contain(url + '?callback=jQuery');
            // should set default timeout
            expect(settings.timeout).to.be.a('number');

            done();
            return false;
          }
        });
      });
    });
  });
});
