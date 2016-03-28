const seneca = require('seneca')();
const _ = require('lodash');
const moment = require('moment');

const db = require('./laboratory.json');

seneca.add({role: 'analysis', cmd: 'listAnalizes'}, function (msg, respond) {
  respond(null, { data: JSON.stringify(db.executedAnalysis)});
});

seneca.add({role: 'analysis', cmd: 'showAnalysis'}, function (msg, respond) {
  const analysis = db.executedAnalysis.find(analysis => analysis.id === +msg.id);
  if (!analysis) return respond(`cannot find analysis with id ${msg.id}`);

  respond(null, { data: JSON.stringify(analysis) });
});

seneca.add({role: 'analysis', cmd: 'addAnalysis'}, function (msg, respond) {
  if (!msg.data.id) return respond(`missing id`);
  db.executedAnalysis.push(msg.data);

  respond(null, { data: 'Added' });
});

seneca.add({role: 'analysis', cmd: 'updateAnalysis'}, function (msg, respond) {
  const analysisIndex = db.executedAnalysis.findIndex(analysis => analysis.id === +msg.id);
  if (!analysis) return respond(`cannot find analysis with id ${msg.id}`);
  db.executedAnalysis[analysisIndex] = _.assign(db.executedAnalysis[analysisIndex], msg.data);

  respond(null, { data: JSON.stringify(db.executedAnalysis[analysisIndex]) });
});

seneca.add({role: 'analysis', cmd: 'checkAnalysis'}, function (msg, respond) {
  const analysis = db.executedAnalysis.find(analysis => analysis.id === +msg.id);
  if (!analysis) return respond(`cannot find analysis with id ${msg.id}`);
  if (!analysis.results) return respond(`There are no results yet for this analysis`);

  const client = db.clients.find(client => client.id === analysis.clientId);
  const clientAge = moment().diff(moment(client.birthDate, 'DD.MM.YYYY'), 'years');
  const norm = db.norms.find(norm =>
    norm.analysisId === analysis.analysisId &&
    norm.gender === client.gender &&
    clientAge > norm.ageFrom &&
    clientAge < norm.ageTo
  );

  if (analysis.results > norm.normFrom && analysis.results < norm.normTo) {
    return respond(null, { data: 'Analisis is normal' });
  } else if (analysis.results < norm.normFrom) {
    return respond(null, { data: 'Less then normal' });
  } else {
    return respond(null, { data: 'More then normal' });
  }

});

seneca.add({role: 'analysis', cmd: 'formAnalysis'}, function (msg, respond) {
  const analysis = db.executedAnalysis.find(analysis => analysis.id === +msg.id);
  if (!analysis) return respond(`cannot find analysis with id ${msg.id}`);
  const form = db.forms.find(form => form.execAnalysisId === analysis.id);

  respond(null, { data: JSON.stringify(_.assign(analysis, form)) });
});

module.exports = seneca;