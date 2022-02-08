const { createProxyMiddleware } = require('http-proxy-middleware')

// onAfterSetupMiddleware and onBeforeSetupMiddleware
module.exports = function(app) {
    app.use(
        createProxyMiddleware('/api', {
            target: 'http://localhost:5000',
            changeOrigin: true,
            secure: false
        })
    );
};
