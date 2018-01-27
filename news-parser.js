const http = require('http');
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
let $;

request('https://news.yandex.ru/computers.html?from=index', (err, res, html) => {
    if (err) throw err;
    $.load(html);
    let news = '';
    news += $.
    addNews(news, '.container');
});


function addNews (data, wrapSelector){
  fs.writeFile('./index.html', data, (err) => { //убрать, вместо этого писать в враппер
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
}
