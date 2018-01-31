const express = require('express');
const bodyParser = require('body-parser');
const jade = require('jade');
const app = express();
const PORT = 80;

// app.use(bodyParser());

app.get('/', (req, res) => {
  let html = jade.compileFile('./lesson4-app/views/index.jade');
  res.send(html);
});

app.listen(PORT, () => {
  console.log('server has been started http://localhost:' + PORT)
});
