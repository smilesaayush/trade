var http = require('http');
var Renko = require('./renkoAnalysis');
//import Renko from './renkoAnalysis';


let renkoAnalysis;

http.createServer(function (req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    let data = JSON.parse(body);
    res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    res.end('ok');
    
    renkoAnalysis = Renko(2, 5 * 60 * 1000);
    process(data);
  });
}).listen(8000);


function process(data) {
  let i;
  let candles = data.data.candles;
  for(i=0;i<candles.length;i++) {
    renkoAnalysis.analyze(candles[i][4], candles[i][0]);
  }
  console.log(renkoAnalysis.renkoResult);
}