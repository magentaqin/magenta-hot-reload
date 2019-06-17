# magenta-hot-reload

#### Dead-HMR
* Install: `make install-dead-hmr`

* Run: `make run-dead-hmr`

* Description:

It is a simple DIY HMR, and is based on none of these frameworks: React/Vue/Angular. It can only detects changes of *.html, *.css and *.js files.

* How it works

- Start the app, and listen to port 3001.

- Create websocket connection, and listen to port 8000.

- Watch file changes, read file content and send messages to websocket client.

- Websocket client handle messages from websocket server.

If it is of type `html`, re-write the file.

If it is of type `css`, remove previous <link> tag, and add new <link> tag.

If it is of type `js`, use `eval()` to execute script.

( To be noticed, if we don't remove previous listeners before excuting script, listeners will be pushed to the element listener array. To fix this, we have to remove all of the previous listeners. The easy way is to clone old node, and replace it with a new one.)

* Serious bug of Dead-HMR: `No Diff`. I just simply replace the whole old one the new one.
