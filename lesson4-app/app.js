const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const jade = require('jade');
const cheerio = require('cheerio');
const app = express();
const PORT = 80;

// app.use(bodyParser());
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

app.get('/', (req, res) => {
  res.send(renderIndex());
});

app.get('/news-list', (req, res) => {
  let html = renderIndex();
  const $ = cheerio.load(html);
  function yield(data) {
    $('#container').html(data);
    res.send($.html());
  }
  sendRequest('https://news.yandex.ru/politics.html?from=rubric', '.story', yield);

});

app.listen(PORT, () => {
  console.log('server has been started http://localhost:' + PORT)
});
