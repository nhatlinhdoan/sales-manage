var express = require('express');
var router = express.Router();
var React = require('react');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sales-manage App' });
});
router.get('/index', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;
