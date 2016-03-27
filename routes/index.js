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
router.get('/upload/:uuid', function(req,res) {
    res.send(db('get', req.params.uuid));
});

router.get('/files/:uuid', function(req,res) {
    res.render('files');
});

module.exports = router;