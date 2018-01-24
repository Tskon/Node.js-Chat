const http = require('http');
const request = require('request');
const fs = require('fs');

const startSrv = (data) => {
  const srv = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end(data);
  });
  srv.listen(80);
  console.log('server has been started');
};

request('https://news.yandex.ru/computers.html?from=index', (err, res, body) => {
  if (err) {
    console.log('error:', err);
    throw err;
  }
  console.log('ya-news statusCode:', res.statusCode);
  createIndex(body);
});

const createIndex = (data) => {
  fs.writeFile('./index.html', data, (err) => {
    if (err) throw err;
    console.log('index.html has been wrote');
    const index = fs.readFile('./index.html', (err) => {
      if (err) throw err;
      startSrv(index);
    })
  });
};



