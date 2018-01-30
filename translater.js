const http = require('http');
const fs = require('fs');
const request = require('request');
const url = require('url');
const port = 80;

const srv = http.createServer((req, res) => {
  if (req.headers["x-requested-with"] === 'XMLHttpRequest') {
    let str = url.parse(req.url, true);
    if (str.pathname === '/en-ru') {
      const query = str.query;
      const key = 'trnsl.1.1.20180130T094621Z.9e85b313d2bb6db4.550aff25cf2dd8585b9d068b15f7ac9c1eb3e896';
      request('https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key +
        '&text=' + query.word + '&lang=en-ru', (err, response, answ) => {
        if (err) throw err;
        answ = JSON.parse(answ);
        if (answ.code === 200 && response.statusCode === 200) {
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end(answ.text.toString());
        }
      });
    }
  }else {

    fs.readFile('./view/translater.html', (err, html) => {
      if (err) throw err;

      res.statusCode = 200;
      res.write(html);
      res.end();
    })
  }
}).listen(port);

console.log('srv has been started http://localhost:' + port + '/');