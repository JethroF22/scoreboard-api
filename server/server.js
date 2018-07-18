const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  require('dotenv').config();
} else if (env === 'test') {
  require('dotenv').config({ path: './.env.test' });
}

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
const Scoreboard = require('./models/scoreboard');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/add', (req, res) => {
  console.log(req.body);
  const data = _.pick(req.body, ['name', 'score', 'time']);
  console.log('data:', data);

  Scoreboard.create(data)
    .then(score => {
      Scoreboard.find({}).then(scores => {
        scores = scores.map(score => _.pick(score, ['name', 'score', 'time']));
        res.send({ scores });
      });
    })
    .catch(err => res.status(400).send());
});

app.listen(process.env.PORT, () => {
  console.log(`Server is live on port ${process.env.PORT}`);
});

module.exports = app;
