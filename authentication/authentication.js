var express = require('express'),
		router = express.Router(),
		jwt = require('jsonwebtoken');

router.post('/authenticate', function(req, res, next) {
  if(req.body.username === '' || req.body.password === '') {
    res.send(401, 'Wrong user or password');
    return;
  }

  var profile = {
    name: ''
  };

  // sending profile inside the token
  var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

  res.send({ token: token });
});

module.exports = router;