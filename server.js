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
    if (process.env.NODE_ENV != 'production') {
        emoji = ["/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAQI/8QAHhAAAgIDAAMBAAAAAAAAAAAAAQIDBAUGEQASEyH/xAAVAQEBAAAAAAAAAAAAAAAAAAAFBv/EACERAAEDAQkAAAAAAAAAAAAAABEAARIxAwQTFCFhcaHw/9oADAMBAAIRAxEAPwDeW478Vu0J7gyz4y5sC69VrYiZoSr+7xvYmdSG9A8bjgIAAH4SfGnb8Wu356YyyYynsDa9arZeZpSz+6RpYhdizeheRBwkggn8BHkm1Y7YdLyNpaTZAUJ7li7Wt0cY+RjH2f6SQzwRn6dEhYqy8HDzvejxquO2HdMjVW62QNCG5Xu2bd7GPjoz8X+kcMEEh+nTIFLM3Rwc6TweRc75nIQcmo0HNBsmRZYRLD3a/9k="];
        return res.status(200).json(emoji);
    }

    docxPdfToImage.convert(
        req.body.type,
        req.file.destination,
        req.file.filename
    ).then( function (b64ImageArray) {
        res.status(200).json(b64ImageArray);
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
