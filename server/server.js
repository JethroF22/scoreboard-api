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
  const data = _.pick(req.body, ['name', 'score', 'time']);

  Scoreboard.create(data)
    .then(score => {
      Scoreboard.find({}).then(scores => {
        scores = scores
          .sort((scoreA, scoreB) => {
            return scoreA.score > scoreB.score
              ? 1
              : scoreA.score < scoreB.score
                ? -1
                : 0;
          })
          .map((score, index) => {
            score = _.pick(score, ['name', 'score', 'time']);
            return { rank: index + 1, ...score };
          });
        res.send({ scores });
      });
    })
    .catch(err => res.status(400).send());
});

app.listen(process.env.PORT, () => {
  console.log(`Server is live on port ${process.env.PORT}`);
});

module.exports = app;
