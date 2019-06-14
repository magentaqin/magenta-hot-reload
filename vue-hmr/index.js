const Koa = require('koa');
const compiler = require('vue-template-compiler');
const fs_promise = require('fs').promises;

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    const result = await compileToJS();
    console.log(result);
  } catch(e) {
    ctx.status = 404;
    return next();
  }
  next();
});

const compileToJS = async (path) => {
  const vueContent = await fs_promise.readFile('./vue-hmr/static/App.vue', {
    encoding: 'utf-8'
  });
  const parsed = compiler.parseComponent(vueContent);
  const template = parsed.template ? parsed.template.content.trim() : '';
  const script = parsed.script ? parsed.script.content.trim() : '';
  const styles = parsed.styles ? parsed.styles[0].content.trim() : '';

  await fs_promise.writeFile('./vue-hmr/static/app.vue.js', script);
  // write css file
  await fs_promise.writeFile('./vue-hmr/static/style.css', styles);
}

app.listen(3002);