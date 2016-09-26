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

app.post('/api/convert', upload.single('file'), function(req, res) {
    docxPdfToImage.convert(
        req.body.type,
        req.file.destination,
        req.file.filename
    ).then( function (data) {

    }).catch( function (error) {
        res.status(500).json({
            error: error
        });
    });
});

app.use('*',function(req,res){
    res.status(404).send('404');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
