var seneca = require('seneca')()

//server
const send = {
  role: 'letter',
  cmd: 'send'
};

seneca.add(send, function(msg, respond) {

  respond(null, {
    answer: `sent to email ${msg.email}`,
  })
})

// client
const action = {
  role: 'letter',
  cmd: 'send',
  email: 'tirli95@gmail.com',
  text: 'Hello, Kate'
};
seneca.act(action, function(err, result) {
  if (err) return console.error(err);
  console.log(result)
})
