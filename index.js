
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

var phantom = require("phantom");

var express = require('express'),
    fs = require('fs'),
    app = express();



app.get('/', function (req, res) {
    res.send('hola!');
});

app.get('/gen', function (req, res) {
    imagemin(['sample/*.{jpg,png}'], 'sample/compressed', {
        plugins: [
            imageminMozjpeg(),
            imageminPngquant({quality: '65-80'})
        ]
    }).then(files => {
        console.log(files);
        //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]

        var _ph, _page, _outObj;
        phantom.create().then(ph => {
            _ph = ph;
            return _ph.createPage();
        }).then(page => {
            _page = page;
            _page.property('paperSize', {format: 'A4', orientation: 'portrait', margin: '0cm'});
            _page.property('viewportSize', {width: 768, height: 1024});
            return _page.open('file:///C:/Users/f.tkaczyszyn/Desktop/iusis/sample/compressed/index.html');

        }).then(status => {
            console.log(status);
            //_page.render('page.png');
            _page.render('page.pdf');
            return _page.property('content')
        }).then(content => {
            console.log(content);
            _page.close();
            _ph.exit();
        }).catch(e => console.log(e));
    });
});





app.listen(3000, function(){
    console.log('Listening on 3000');
});
