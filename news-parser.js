const http = require('http');
const request = require('request');
const fs = require('fs');

const createIndex = (data) => {
  fs.writeFile('./index.html', data, (err) => {
    if (err) throw err;
    console.log('index.html has been wrote');

    http.createServer((req, res) => {

      fs.readFile('./index.html', function (err, file) {
        if (err) throw err;

        res.writeHead(200);
        res.write(file);
        res.end();
      });

    }).listen(80);
    console.log('server has been started http://localhost/');
  });
};

request('https://news.yandex.ru/computers.html?from=index', (err, res, body) => {
  if (err) throw err;
  createIndex(body);
});
