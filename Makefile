install-dead-hmr:
	cd dead-hmr && yarn
run-dead-hmr:
	cd dead-hmr && node index.js
run-webpack-hot-client-demo:
	cd easy-hot-client && node server.js