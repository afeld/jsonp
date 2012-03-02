var connect = require('connect'),
    jsonp = require('connect-jsonp'),
    helpers = require('./helpers'),
    assert = require('assert'),
	mime = require('connect/utils').mime;

connect.jsonp = jsonp;

var expectRes = "{'data': 'data'}";
var expectPaddedRes = "cb({'data': 'data'})";


function server(headers, code) {
    headers = headers || {};
    code = code || 200;
    return helpers.run(
        connect.gzip(),
        connect.jsonp(true),
        connect.createServer(
            function(req, res) {
                res.writeHead(code, headers);
                res.write(expectRes)
                res.end();
            }
        )
    );
}

function assertPadded(res, padded) {
    if (padded) {
        assert.eql(expectPaddedRes, res.body);
        assert.eql(mime.type('.js'), res.headers['content-type']);
        assert.eql(expectPaddedRes.length, res.headers['content-length']);
    
    } else {
        assert.eql(expectRes, res.body);     
    }
}

module.exports = {
    'test not a padding request': function() {
        var req = server().request('GET', '/', { });
        req.buffer = true;
        req.addListener('response', function(res) {
            res.addListener('end', function() {
                assertPadded(res, false);
            });
        });
        req.end();
    },

    'test not a GET request': function() {
        var expect = 'cb({"error":"method not allowed","description":"with callback only GET allowed"})';
        helpers.run(connect.jsonp()).assertResponse(
            'POST', 
            '/?callback=cb', 
            400, 
            expect,
            '',
            function(res) {
                assert.eql(mime.type('.js'), res.headers['content-type']);
                assert.eql(expect.length, res.headers['content-length']);
            }
        );
    },

    'test query string': function() {
        var req = server().request('GET', '/test?callback=cb&test=test', { });
        req.buffer = true;
        req.addListener('response', function(res) {
            res.addListener('end', function() {
                assertPadded(res, true);
            });
        });
        req.end();  
    },

    'test query string removing callback param': function() {
        var req = server().request('GET', '/test?callback=cb&test=test', { });
        req.buffer = true;
        req.addListener('response', function(res) {
            res.addListener('end', function() {
                assertPadded(res, true);
            });
        });
        req.end();  
    },

   'test plays nice with others': function() {
        var req = server().request('GET', '/test?callback=cb', {
            'Accept-Encoding': 'deflate, gzip'
        });
        req.buffer = true;
        req.addListener('response', function(res) {
            res.addListener('end', function() {
                assert.eql(mime.type('.js'), res.headers['content-type']);
                assert.eql('gzip', res.headers['content-encoding']);
                // test compression
                //assert.eql("cb({data: 'data'})", res.body);
            });
        });
        req.write('callback=cb');
        req.end();
    }
}