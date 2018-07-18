const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server');
const Scoreboard = require('../models/scoreboard');

describe('POST /add', () => {
  let token, score, url;
  beforeEach(function(done) {
    this.timeout(0);
    Scoreboard.remove({}).then(() => done());
    token = 'authentication';
    score = {
      name: 'me',
      score: 12345,
      time: '01:23'
    };
    url = '/add';
  });

  it('should add a score to the database', done => {
    request(app)
      .post(url)
      .set('token', token)
      .send(score)
      .expect(200)
      .expect(res => {
        expect(res.body.scores.length).to.equal(1);
      })
      .end(done);
  });

  it('should return a 401 for requests without a token', done => {
    request(app)
      .post(url)
      .send(score)
      .expect(401)
      .end(done);
  });
});

describe('GET /scores', () => {
  let token, url;
  beforeEach(function(done) {
    this.timeout(0);
    const scores = [
      {
        name: 'me',
        score: 123,
        time: '09:34'
      },
      {
        name: 'you',
        score: 457,
        time: '03:49'
      }
    ];
    Scoreboard.remove({})
      .then(() => {
        return Scoreboard.insertMany(scores);
      })
      .then(() => done());
    token = 'authentication';
    url = '/scores';
  });

  it('should fetch scores from the database', done => {
    request(app)
      .get(url)
      .set('token', token)
      .expect(200)
      .expect(res => {
        expect(res.body.scores.length).to.equal(2);
      })
      .end(done);
  });

  it('should return a 401 for requests without a token', done => {
    request(app)
      .get(url)
      .expect(401)
      .end(done);
  });
});
