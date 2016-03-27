var fs = require('fs');
var file = './database.sqlite3';
var exists = fs.existsSync(file);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var getFromDatabase = function(obj){
   db.parallelize(function() {
    if(obj.length){
        db.get("SELECT * FROM files where fileName = '" + obj + "';", function(err, row) {
            if(!err){
                if(row)
                    return row;
                else
                    return obj + " not found in database";
            }
            else{
                return err;
            }

        });
    }
   });
}

var saveToDatabase = function(obj) {
    db.serialize(function() {
    if(!exists)
        db.run('CREATE TABLE files (fileName TEXT, name TEXT, mimeType TEXT, size INT)');
    var st = db.prepare("INSERT INTO files VALUES ($fileName, $name, $mimeType, $size)");
    
    //run only if object is not empty
    if(Object.keys(obj).length){
        st.run({
        $fileName: obj.fileName,
        $name: obj.originalName,
        $mimeType: obj.mimeType,
        $size: obj.size
    });
    }
    st.finalize();
});
}

var database = function(t, obj) {
    if(t=='upload')
        saveToDatabase(obj);
    if(t=='get')
        getFromDatabase(obj);
};
module.exports = database;