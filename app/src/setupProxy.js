// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api", // Your API endpoint path
    createProxyMiddleware({
      target: "http://localhost:5050", // Your backend server address
      changeOrigin: true,
      timeout: 60000,
    })
  );
};
