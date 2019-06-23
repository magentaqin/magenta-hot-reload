const hotClient = require('webpack-hot-client');
const middleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const path = require('path');

const config = require('./webpack.config');

const express = require('express');
const app = express();

// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, './index.html'));
// });

// app.get('/app.js', function(req, res) {
//   res.sendFile(path.join(__dirname, './src/app.js'));
// })

const compiler = webpack(config);

// Specify websocket listening port. Important!
const options = {
  port: 8000
}
const client = hotClient(compiler, options);

const { publicPath } = config.output;
const devMiddleware = middleware(compiler, { publicPath });
app.use(devMiddleware);

const port = process.env.PORT || 3002
app.listen(port, () => {
  console.log(`Server is listening on ${port} port.`)
});
