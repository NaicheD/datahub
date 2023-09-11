const logInFilter = function (pathname, req) {
    return pathname.match('^/logIn') && req.method === 'POST';
};

if (process.env.REACT_APP_MOCK === 'true' || process.env.REACT_APP_MOCK === 'cy') {
    // no proxy needed, MirageJS will intercept all http requests
    module.exports = function () {
    };
} else {
    // create a proxy to the graphql server running in docker container
    const {createProxyMiddleware} = require('http-proxy-middleware');

    const proxyTarget = 'http://localhost:9002';

    module.exports = function (app) {
        app.use(
            '/logIn',
            createProxyMiddleware(logInFilter, {
                target: proxyTarget,
                changeOrigin: true,
            }),
        );
        app.use(
            '/authenticate',
            createProxyMiddleware({
                target: proxyTarget,
                changeOrigin: true,
            }),
        );
        app.use(
            '/api/v2/graphql',
            createProxyMiddleware({
                target: proxyTarget,
                changeOrigin: true,
            }),
        );
    };
}
