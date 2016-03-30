var soap = require('soap');
var url = 'http://andrei.xianet.com.ua/public/storage.php?r=item';

soap.createClient(url, function(err, client) {
  client.getAllItems({product_id: null, storage_id: null, status_id: null}, function(err, result) {
    console.log(result.return.item);
  });
});
