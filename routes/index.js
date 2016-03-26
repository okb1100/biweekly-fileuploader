var express = require('express');
var router = express.Router();
var save = require('../save');
var db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/upload', function(req ,res, next) {
    save(req, res);
});

router.get('/files/:uuid', function(req,res) {
    db('get', req.params.uuid);
});

module.exports = router;