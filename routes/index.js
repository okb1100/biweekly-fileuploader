var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({dest: 'uploads/'}).any();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/upload', function(req ,res) {
    upload(req,res,function(err) {
        if(err){
            return res.end("Errör");
        }
        res.end("Upload Success.");
    });
});

module.exports = router;