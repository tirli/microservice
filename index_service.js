const route = require('koa-route');
const koa = require('koa');
const app = koa();
const bodyParser = require('koa-bodyparser');
const co = require('co');
const Promise = require('bluebird');

const seneca = require('./analysis');

const promisedAct = Promise.promisify(seneca.act, seneca);
const act = co.wrap(promisedAct);

const analysis = {
  list: function *() {
    yield act({role: 'analysis', cmd: 'listAnalizes'}).then((err, result) => {
      if (err) return this.throw(err, 400);
      this.body = result;
    });
  },

  show: function *(id) {
    yield act({role: 'analysis', cmd: 'showAnalysis', id}).then((err, result) => {
      if (err) return this.throw(err, 400);
      this.body = result;
    });
  },

  add: function *() {
    const data = this.request.body;
    yield act({role: 'analysis', cmd: 'addAnalysis', data}).then((err, result) => {
      if (err) return this.throw(err, 400);
      this.body = result;
    });
  },

  checkNorm: function *(id) {
    yield act({role: 'analysis', cmd: 'checkAnalysis', id}).then((err, result) => {
      if (err) return this.throw(err, 400);
      this.body = result;
    });
  },

  form: function *(id) {
    yield act({role: 'analysis', cmd: 'formAnalysis', id}).then((err, result) => {
      if (err) return this.throw(err, 400);
      this.body = result;
    });
  },

  update: function *(id) {
    const data = this.request.body;
    yield act({role: 'analysis', cmd: 'updateAnalysis', id, data}).then((err, result) => {
      if (err) return this.throw(err, 400);
      this.body = result;
    });
  }
};

app.use(route.get('/analysis', analysis.list));
app.use(route.get('/analysis/:id', analysis.show));
app.use(route.get('/analysis/:id/check', analysis.checkNorm));
app.use(route.get('/analysis/:id/form', analysis.form));

app.use(bodyParser());

app.use(route.post('/analysis', analysis.add));
app.use(route.put('/analysis/:id', analysis.update));

app.listen(3000);
console.log('listening on port 3000');
