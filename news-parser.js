const http = require('http');
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');

request('https://news.yandex.ru/computers.html?from=index', (err, res, html) => {
  if (err) throw err;
  const $ = cheerio.load(html);
  let news = $('.story');
  addNews(news, '.container');
});


function addNews(data, wrapSelector) {

  http.createServer((req, res) => {

    fs.readFile('./index.html', function (err, file) {
      if (err) throw err;
      const $ = cheerio.load(file);
      $(wrapSelector).html(data);
      res.writeHead(200);
      res.write($.html());
      res.end();
    });

  }).listen(80);
  console.log('server has been started http://localhost/');

}
