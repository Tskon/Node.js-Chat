const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const request = require('request');
const jade = require('jade');
const cheerio = require('cheerio');
const app = express();
const PORT = 80;
let urlQuery;

const renderIndex = () => {
  return jade.renderFile('./lesson4-app/views/index.jade', (err, html) => {
    if (err) throw err;
    return html;
  });
};

function sendRequest(url, selector, callback) {
  request(url, (err, res, html) => {
    if (err) throw err;
    const $ = cheerio.load(html);
    let selection = $(selector);
    callback(selection.html());
  });
}

app.use(bodyParser());

app.use((req, res, next) => {
  urlQuery = url.parse(req.url, true).query;
  next();
});

app.get('/', (req, res) => {
  res.send(renderIndex());
});

app.get('/news-list', (req, res) => {
  console.log(urlQuery);
  let newsTheme;
  let siteObj;
  const urlYandex = {
    'sport': ['https://news.yandex.ru/sport.html?from=rubric', '.story'],
    'economic': ['https://news.yandex.ru/business.html?from=rubric', '.story'],
    'politic': ['https://news.yandex.ru/politics.html?from=rubric', '.story']
  };
  const urlRiaNews = {
    'sport': ['https://rsport.ria.ru/hockey/', '.b-list__item'],
    'economic': ['https://ria.ru/economy/', '.b-list__item'],
    'politic': ['https://ria.ru/politics/', '.b-list__item']
  };
  switch (urlQuery.resource) {
    case 'Yandex': {siteObj = urlYandex; break;}
    case 'Риа Новости': {siteObj = urlRiaNews; break;}
  }
  switch (urlQuery.theme){
    case 'Спорт': {newsTheme = 'sport'; break;}
    case 'Экономика': {newsTheme = 'economic'; break;}
    case 'Политика': {newsTheme = 'politic'; break;}
  }
  let html = renderIndex();
  const $ = cheerio.load(html);

  function yield(data) {
    $('#container').html(data);
    res.send($.html());
  }
  sendRequest(siteObj[newsTheme][0], siteObj[newsTheme][1], yield);
});

app.listen(PORT, () => {
  console.log('server has been started http://localhost:' + PORT)
});
