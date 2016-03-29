var multer = require('multer');
var database = require('./db');

// https://gist.github.com/jed/982883
var uuid = function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)};

var storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function(req,file,cb) {
        cb(null, uuid());
    }
});
var upload = multer({storage: storage}).any();

var save = function(req,res) {
    upload(req,res,function(err) {
            if(!req.files.length)
                return res.status(400).send("I didn't get any file ?");
            if(err){
                return res.end("Errör");
            }
            var file = req.files[0];
            database('upload', {
                fileName: file.filename,
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype
            });
            res.end(file.filename);
        });
};

module.exports = save;