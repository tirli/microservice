var soap = require('soap');
var url = 'http://andrei.xianet.com.ua/public/delivering.php?r=ticket';

soap.createClient(url, function(err, client) {
  client.getAllTickets({order_id: null, address: null, courier_id: null}, function(err, result) {
    console.log(result.return);
  });
});
