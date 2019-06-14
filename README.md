# magenta-hot-reload

If you want to undestand something, try to build it by yourself.

This project is divided into 4 parts.

#### Dead-HMR
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

#### Vue-HMR

Although I use vue syntax, I haven't imported neither Vue package nor webpack related packages into this project. The aim is to get full grasp of how Vue actually works under the hood. This includes:

1.how to compile Vue files to *.html, *.css and *.js files.

2.how it diffs node, and insert it to DOM so accurately.