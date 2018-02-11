const express = require('express');
const url = require('url');
const bodyParser = require('body-parser');
const request = require('request');
const jade = require('jade');
const cheerio = require('cheerio');
const app = express();
const PORT = 80;
let urlQuery;

app.set('views', './lesson4-app/views');
app.set('view engine', 'jade');

function sendRequest(url, selector, callback) {
  // console.log(url, selector);
  request(url, (err, res, html) => {
    if (err) throw err;

    const $ = cheerio.load(html);
    let selection = $(selector);
    console.log();
    callback(selection.html());
  });
}

app.use(bodyParser());

app.use((req, res, next) => {
  urlQuery = url.parse(req.url, true).query;
  next();
});

app.get('/', (req, res) => {

  res.render('index', {title: 'Lesson4'})
});

app.get('/news-list', (req, res) => {
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
  let html = renderIndex();
  const $ = cheerio.load(html);

  function yield(data) {
    data = data || '';
    // console.log(data);
    $('#container').html(data);
    res.send($.html());
  }

  sendRequest(siteObj[newsTheme][0], siteObj[newsTheme][1], yield);

});

app.listen(PORT, () => {
  console.log('server has been started http://localhost:' + PORT)
});
