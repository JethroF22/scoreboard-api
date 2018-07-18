const authenticate = (req, res, next) => {
  const token = req.header('token');
  console.log('token', token);

  if (token && token === process.env.AUTH_TOKEN) {
    next();
  } else {
    res.status(401).send({ msg: 'Authentication error' });
  }
};

module.exports = authenticate;
