const Koa = require('koa');
const WebSocket = require('ws');
const chokidar = require('chokidar');

const app = new Koa();
const fs_promise = require('fs').promises;
const path = require('path');
const wss = new WebSocket.Server({ port: 8000 });

const watcher = chokidar.watch('./dead-hmr/static', {
  ignored: /node_modules|\.git/,
});

// Put chokidar watcher on websocket server side, and use it to watch changes.
wss.on('connection', (ws) => {
  console.log('Websocket server is connected.');

  watcher.on('add', path => console.log(`File ${path} added.`))
         .on('change', path => console.log(`File ${path} has been changed.`))
         .on('unlink', path => console.log(`File ${path} has been moved`))
         .on('error', error => log(`Watcher error: ${error}`))
         .on('all', async (event, filePath) => {
            let message = '';
            console.log('Changed file extname', path.extname(filePath));
            switch(path.extname(filePath)) {
              case '.html':
                body = await fs_promise.readFile(filePath, { encoding: 'utf-8'});
                message = JSON.stringify({ type: 'html', content: body });
                break;
              case '.css':
                message = JSON.stringify({ type: 'css', content: filePath.split('static/')[1] });
                break;
              case '.js':
                body = await fs_promise.readFile(filePath, { encoding: 'utf-8'});
                message = JSON.stringify({ type: 'js', content: body });
                break;
              default:
                throw new Error('Invalid file format');
            }
            ws.send(message);
         });
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });
    ws.on('error', (err) => {
      console.log('Websocket server error %s', err);
    })
});

const InjectedScript = `<script>{
  // create websocket connection
  const socket = new WebSocket('ws://localhost:8000');

  socket.addEventListener('open', (event) => {
    console.log('Websocket client is ready.');
  });

  socket.addEventListener('message', function(event) {
    let data = {};
    console.log(event.data);
    if (!JSON.parse(event.data).type) {
      return;
    }
    try {
      data = JSON.parse(event.data);
    } catch(e) {
      console.log(e);
      console.log('message listener error!!!')
    }

    switch(data.type) {
      case 'html':
        document.write(data.content);
        document.close();
        console.log('HTML file updated.')
        break;
      case 'css':
        document.querySelectorAll('link[rel="stylesheet"]').forEach(el => {
          const resource = el.href.split(location.host + '/')[1];
          if (resource === data.content) {
            el.remove();
          }
          document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + data.content + '" />');
          console.log('CSS file updated.');
        });
        break;
      case 'js':
        const old_body = document.querySelector('body');
        const new_body = old_body.cloneNode(true);
        old_body.parentNode.replaceChild(new_body, old_body);
        eval(data.content);
        console.log('JS file updated.');
        break;
      default:
        throw new Error('Invalid file format');
    }
  })
}</script>`

app.use(async (ctx, next) => {
  let file = ctx.path;
  console.log('CTX PATH', file);

  if (ctx.path.endsWith('/')) {
    file = ctx.path + 'index.html';
  }
  let body;
  try {
    body = await fs_promise.readFile('./dead-hmr/static' + file, {
      encoding: 'utf-8'
    });
  } catch(e) {
    ctx.status = 404;
    return next();
  }
  if (file.endsWith('.html')) {
    body = body.replace('<body>', `<body>${InjectedScript}`);
  }
  if (file.endsWith('.css')) {
    ctx.type = 'text/css';
  }
  if (file.endsWith('.js')) {
    ctx.type = 'text/javascript';
  }
  ctx.body = body;
  next();
});

app.listen(3001);

console.log('listen on port 3001');