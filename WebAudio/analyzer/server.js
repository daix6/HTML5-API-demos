'use strict';

const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();


app.use(function* (next) {
  yield next;

  if (this.status !== 404) return;

  this.body = 'Not Found';
});

app.use(serve('.'));

app.listen(3000, function() {
    console.log('Server is listening on http://localhost:%s', 3000);
});
