const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const request = require('request');
const pug = require('pug');
const cheerio = require('cheerio');
const app = express();
const PORT = 80;
let urlQuery;

app.set('views', './lesson4-app/views');
app.set('view engine', 'pug');

function sendRequest(url, selector, callback) {
  // console.log(url, selector);
  request(url, (err, res, html) => {
    if (err) console.log(err);

    const $ = cheerio.load(html);
    let selection = $(selector);
    console.log();
    callback(selection.html());
  });
}

app.use(bodyParser());
app.use(cookieParser());

app.use((req, res, next) => {
  urlQuery = url.parse(req.url, true).query;
  next();
});

app.get('/', (req, res) => {
  res.render('index', {title: 'Lesson4', newsFrom: {site: null, theme: null}})
});

app.get('/news-list', (req, res) => {
  // set cookie
  const cookieStr = `{"site": "${urlQuery.resource}","theme": "${urlQuery.theme}"}`;
  res.cookie('news-from', cookieStr);

  // get cookie
  let cookieNewsFrom = {site: null, theme: null};
  if (req.cookies['news-from']){
    cookieNewsFrom = JSON.parse(req.cookies['news-from']);
  }

  // vars for request
  let newsTheme;
  let siteObj;
  const urlYandex = {
    'sport': ['https://news.yandex.ru/sport.html?from=rubric', '.story'],
    'economic': ['https://news.yandex.ru/business.html?from=rubric', '.story'],
    'politic': ['https://news.yandex.ru/politics.html?from=rubric', '.story']
  };
  const urlMailRu = {
    'sport': ['https://sport.mail.ru/', 'cols__inner'],
    'economic': ['https://news.mail.ru/economics/', 'cols__inner'],
    'politic': ['https://news.mail.ru/politics/', 'cols__inner']
  };
  switch (urlQuery.resource) {
    case 'Yandex': {
      siteObj = urlYandex;
      break;
    }
    case 'Mail.ru': {
      siteObj = urlMailRu;
      break;
    }
  }
  switch (urlQuery.theme) {
    case 'Спорт': {
      newsTheme = 'sport';
      break;
    }
    case 'Экономика': {
      newsTheme = 'economic';
      break;
    }
    case 'Политика': {
      newsTheme = 'politic';
      break;
    }
  }

  // render page
  console.log(cookieNewsFrom);
  let html = res.render('index', {title: 'News', newsFrom: cookieNewsFrom}, (err, html) => {
    if (err) throw err;
    const $ = cheerio.load(html);

    // send request
    sendRequest(siteObj[newsTheme][0], siteObj[newsTheme][1], yield);

    // request callback
    function yield(data) {
      data = data || '';
      $('#container').html(data);
      res.send($.html());
    }

  });

});

app.listen(PORT, () => {
  console.log('server has been started http://localhost:' + PORT)
});
