/*jshint browser:true*/
/*global describe, before, beforeEach, after, afterEach, $, it, sinon, expect */
describe('jsonproxy', function(){
  var loc = window.location,
    origin = loc.origin || (loc.protocol + '//' + loc.host),
    proxy = 'https://jsonp.afeld.me/',
    packagePath = loc.pathname.replace(/test.html/, 'package.json'),
    sandbox;

  beforeEach(function(){
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });


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
      sandbox.stub($.jsonp, 'getLocation').callsFake(function(){
        return {
          hash: '',
          host: 'foo.com',
          hostname: 'foo.com',
          href: 'https://foo.com/other/path',
          origin: 'https://foo.com',
          pathname: '/other/path',
          port: '',
          protocol: 'https:'
        };
      });

      var url = 'http://foo.com/other/path';

      $.jsonp({
        url: url,

        beforeSend: function(_, settings){
          expect(settings.url).to.contain(proxy + '?');
          expect(settings.url).to.contain('url=' + encodeURIComponent(url));

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
          expect(settings.url).to.be(proxy + '?url=' + encodeURIComponent(url));

          done();
          return false;
        }
      });
    });

    it("should handle the 'data' option", function(done){
      $.jsonp({
        url: 'http://foo.com',
        data: {
          bar: 'baz'
        },

        beforeSend: function(_, settings){
          expect(settings.url).to.be(proxy + '?url=http%3A%2F%2Ffoo.com%2F%3Fbar%3Dbaz');

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

      it("should use the proxy if protocols don't match", function(done){
        var url = 'http://foo.com/bar';

        sandbox.stub($.jsonp, 'getLocation').callsFake(function(){
          return {
            hash: '',
            host: 'foo.com',
            hostname: 'foo.com',
            href: 'https://foo.com/other/path',
            origin: 'https://foo.com',
            pathname: '/other/path',
            port: '',
            protocol: 'https:'
          };
        });

        $.jsonp({
          url: url,
          corsSupport: true,

          beforeSend: function(_, settings){
            expect(settings.url).to.be(proxy + '?url=' + encodeURIComponent(url));

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
          expect(settings.url).to.contain(proxy + '?');
          expect(settings.url).to.contain('url=' + encodeURIComponent(url));
          expect(settings.url).to.contain('callback=jQuery');
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
