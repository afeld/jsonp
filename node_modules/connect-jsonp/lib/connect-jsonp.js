/*!
 * Copyright(c) 2010 Sean McDaniel <sean.mcdaniel@me.com>
 * MIT Licensed
 */

/**
 * Simple connect middleware providing JSONP support.
 * 
 * Config:
 *   - filter: should stip the callback param from the req.url for downstream processing.  defaults to false.
 * 
 * @return {Function}
 * @api public
 */
module.exports = function jsonp(config) { 
    if ('boolean' == typeof config) {
        config = {filter: config};
    } else {
        config = config || {};
    }   
    
    // @@
    var APP_JS_CONTENT_TYPE = require('connect/utils').mime.type('.js');
    var BAD_REQUEST_BODY = '(' + 
        JSON.stringify({
            error: 'method not allowed', 
            description: 'with callback only GET allowed'       
        }) + 
    ')';

    /**
     * Write out a 400 error, passing it to the callback.
     */
    function badRequest(res, callback) {
        var body = callback + BAD_REQUEST_BODY;      
        res.writeHead(400, {
            'Content-Type': APP_JS_CONTENT_TYPE,
            'Content-Length': body.length
        });
        res.end(body);      
    };    

    /**
     * Unwind.
     */
    function previous(statusCode, headers, res, context, body, encoding) {
        res.writeHead = context.writeHead;
        res.writeHead(statusCode, headers); 
        if (body) {
            res.write = context.write;
            res.end = context.end;
            res.end(body, encoding);
        }
    };

    /**
     * Filter the callback querystring param.  Abstracts the JSONP nature of the request from
     * downstream modules or application logic.    
     */
    function filter(req, url) {
        var callback = new String(url.query.callback);
        delete url.query.callback;
        var querystring = require('querystring').stringify(url.query);
        querystring = querystring.length > 0 ? '?' + querystring : '';
        req.url = url.pathname + querystring;

        return callback;
    };

    /**
     * Response decorator that pads a (json) response with a callback
     * if requested do to so.  
     */ 
    return function jsonp(req, res, next) {
        var url = require('url').parse(req.url, true);
        if (!(url.query && url.query.callback)) {
            next();
            return;
    
        } else if (req.method != 'GET') {
            badRequest(res, url.query.callback); 
            return;
        } 

        var context = {
            callback: config.filter ? filter(req, url) : url.query.callback,
            writeHead: res.writeHead,
            write: res.write,
            end: res.end
        };

        res.writeHead = function(statusCode, headers) {
            if (statusCode === 200) {
                var body = '';
                res.write = function(chunk, encoding) { body += chunk }    
                res.end = function(chunk, encoding) {
                    if (chunk) body += chunk;
                    body = context.callback + '(' + body + ')';
                    headers['Content-Type'] = APP_JS_CONTENT_TYPE;
                    headers['Content-Length'] = body.length;
                    previous(statusCode, headers, res, context, body, encoding);
                };

            } else {
                previous(statusCode, headers, res, context);
            }   
        };

        next();
    };
};