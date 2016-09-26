require('babel-register');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var upload = multer( { dest: '/tmp/' } );
var docxPdfToImage = require('./docx-pdf-to-image');

var app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

/*
app.get('/api/convert', function(req, res) {
    res.send('<form action="/api/convert" method="POST" enctype="multipart/form-data">upload:<input type="file" name="file"> <input type="submit" value="Upload"></form>');
});
*/
app.get('/trysave', function(req, res) {
    var exec = require('child_process').exec;
    exec('touch /tmp/3.txt', function(e, stdout, stderr){ });

    var fs = require('fs');
    fs.writeFile("/tmp/hola.txt", "datos re piolas copados", function (e) {

        fs.readFile('/tmp/hola.txt', 'utf8', function (err, data) {
            if (err) {
                return res.send(err);
            }
            exec('ls /tmp', function(e, stdout, stderr){
                if (e) {
                    return res.send(e);
                }
                res.send(stdout)
            });
        });
    });
});

app.post('/api/convert', upload.single('file'), function(req, res) {
    docxPdfToImage.convert(
        req.body.type,
        req.file.destination,
        req.file.filename
    ).then( function (data) {

    }).catch( function (error) {
        res.status(400).json({
            error: error
        });
    });
    /*
    console.log( req.file );
    console.log(req.body.type);
    if (req.body.type) {

    }
    res.send('[{"converted image": "image data"}]');
    */
});

app.use('*',function(req,res){
    res.status(404).send('404');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
