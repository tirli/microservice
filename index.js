const route = require('koa-route');
const koa = require('koa');
const app = koa();
const bodyParser = require('koa-bodyparser');
const _ = require('lodash');
const moment = require('moment');

const db = require('./laboratory.json');

const analysis = {
  list: function *() {
    this.body = JSON.stringify(db.executedAnalysis);
  },

  show: function *(id) {
    const analysis = db.executedAnalysis.find(analysis => analysis.id === +id);
    if (!analysis) return this.throw(`cannot find analysis with id ${id}`, 404);

    this.body = JSON.stringify(analysis);
  },

  add: function *() {
    const data = this.request.body;
    if (!data.id) return this.throw(`missing id`, 400);
    db.executedAnalysis.push(data);

    this.body = 'Added';
  },

  checkNorm: function *(id) {
    const analysis = db.executedAnalysis.find(analysis => analysis.id === +id);
    if (!analysis) return this.throw(`cannot find analysis with id ${id}`, 404);
    if (!analysis.results) return this.throw(`There are no results yet for this analysis`, 400);

    const client = db.clients.find(client => client.id === analysis.clientId);
    const clientAge = moment().diff(moment(client.birthDate, 'DD.MM.YYYY'), 'years');
    const norm = db.norms.find(norm =>
      norm.analysisId === analysis.analysisId &&
      norm.gender === client.gender &&
      clientAge > norm.ageFrom &&
      clientAge < norm.ageTo
    );

    if (analysis.results > norm.normFrom && analysis.results < norm.normTo) {
      this.body = 'Analisis is normal';
    } else if (analysis.results < norm.normFrom) {
      this.body = 'Less then normal';
    } else {
      this.body = 'More then normal';
    }

  },

  form: function *(id) {
    const analysis = db.executedAnalysis.find(analysis => analysis.id === +id);
    if (!analysis) return this.throw(`cannot find analysis with id ${id}`, 404);
    const form = db.forms.find(form => form.execAnalysisId === analysis.id);

    this.body = JSON.stringify(_.assign(analysis, form));
  },

  update: function *(id) {
    const data = this.request.body;
    const analysisIndex = db.executedAnalysis.findIndex(analysis => analysis.id === +id);
    if (!analysis) return this.throw(`cannot find analysis with id ${id}`, 404);
    db.executedAnalysis[analysisIndex] = _.assign(db.executedAnalysis[analysisIndex], data);

    this.body = JSON.stringify(db.executedAnalysis[analysisIndex]);
  },
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
