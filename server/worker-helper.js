import { cors } from './app-helper';
import proxy from './proxy-request';
import * as jsonp from './jsonp';
import JSON3 from 'json3';
import * as contentHelper from './content-helper';
import * as proxyUtil from './proxy_util';
import url from 'url';
import html from './public/index.html';
import css from './public/app.css';
import svg from './public/forkme.svg';

// only use these in the block below
import fs from 'fs';
import path from 'path';

// can only use loaders when building with webpack, so fall back to normal file reading for tests
if (!process.env.WEBPACK) {
  // eslint-disable-next-line no-global-assign
  require = (srcPath) => {
    const srcAbsPath = path.resolve(__dirname, srcPath);
    return fs.readFileSync(srcAbsPath, 'utf8');
  };
}

const files = {
  '/': html,
  '/app.css': css,
  // https://vshivam.github.io/2016/04/22/github-corner-text/
  '/forkme.svg': svg,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFn = () => {};

function getApiUrl(req) {
  const query = url.parse(req.url, true).query;
  return proxyUtil.getApiUrlFromQuery(query);
}

const proxyReq = async (req) => {
  const apiUrl = getApiUrl(req);
  const proxyRes = await proxy(apiUrl, req).catch((err) => {
    // network error
    const body = JSON3.stringify({ error: err.message });
    return new Response(body, {
      status: 502, // bad gateway
    });
  });

  const reqUrl = new URL(req.url);
  const query = contentHelper.iteratorToObj(reqUrl.searchParams);
  const resHeaders = new Headers(
    contentHelper.passBackHeaders(contentHelper.iteratorToObj(proxyRes.headers))
  );
  let body = await proxyRes.text();
  if (jsonp.isJsonP(query)) {
    body = jsonp.transformJsonPBody(query, body);
    resHeaders.set('content-type', 'text/javascript'); // use instead of 'application/javascript' for IE < 8 compatibility
  }

  // fetch() response isn't mutable, so make a new one
  const res = new Response(body, {
    status: proxyRes.status,
    statusText: proxyRes.statusText,
    headers: resHeaders,
  });

  // make browser Response act like http.ServerResponse
  res.setHeader = res.headers.set.bind(res.headers);
  cors(req, res, emptyFn);

  return res;
};

const getMimeType = (reqPath) => {
  if (reqPath.endsWith('.css')) {
    return 'text/css';
  } else if (reqPath.endsWith('.svg')) {
    return 'image/svg+xml';
  }

  return 'text/html';
};

const render = (req) => {
  let status = 200;

  const parsedUrl = new URL(req.url);
  const reqPath = parsedUrl.pathname;
  let contentType = getMimeType(reqPath);

  const lastSegment = reqPath.substring(reqPath.lastIndexOf('/'));
  let contents = files[lastSegment];

  if (!contents) {
    status = 404;
    contentType = 'text/plain';
    contents = `${lastSegment} not found`;
  }

  return new Response(contents, {
    status,
    headers: { 'content-type': contentType },
  });
};

export default (req) => {
  const apiUrl = getApiUrl(req);
  if (apiUrl) {
    return proxyReq(req);
  }
  return render(req);
};
