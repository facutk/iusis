require('babel-register');

var express = require('express');
var cors = require('cors');
var multer = require('multer');
var upload = multer( { dest: '/tmp/' } );

var app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static('dist'));
app.use(cors());

/*
app.get('/api/convert', function(req, res) {
    res.send('<form action="/api/convert" method="POST" enctype="multipart/form-data">upload:<input type="file" name="file"> <input type="submit" value="Upload"></form>');
});
*/
app.get('/trysave', function(req, res) {
    var exec = require('child_process').exec;
    exec('touch /tmp/3.txt', function(e, stdout, stderr){ });
    
    var fs = require('fs');
    fs.writeFile("/tmp/hola.txt", "datos", function (e) { if (e) return res.send(e); return res.send("ok");});
});

app.post('/api/convert', upload.single('file'), function(req, res) {
    console.log( req.file );
    res.send('[{"converted image": "image data"}]');
});

app.use('*',function(req,res){
    res.status(404).send('404');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
