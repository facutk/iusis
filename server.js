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
                    return res.send(err);
                }
                res.send(stdout)
            });
        });
    });
});

app.get('/lstmp', function(req, res) {
    var exec = require('child_process').exec;
    exec('ls -1 /tmp', function(e, stdout, stderr){
        if (e) {
            return res.send(err);
        }
        res.send(stdout)
    });

});

app.get('/rmtmp', function(req, res) {
    var exec = require('child_process').exec;
    exec('ls -1 /tmp', function(err, stdout, stderr){
        if (err) {
            return res.send(err);
        }


        var files = stdout.split("\n");
        files.forEach( function(file) {
            exec('rm /tmp/' + file, function(err, stdout, stderr){
                if (err) {
                    return res.send(err);
                }
                res.send('deleted')
            });
        });

    });

});


app.get('/gstmp', function(req, res) {
    var exec = require('child_process').exec;
    exec('ls -1 /tmp', function(err, stdout, stderr){
        if (err) {
            return res.send(err);
        }


        var files = stdout.split("\n");
        files.forEach( function(file) {

            var gs_command = "gs -dNOPAUSE -sDEVICE=jpeg -dBATCH -q -sOutputFile=/tmp/" +
                             file + "%03d.jpg /tmp/" + file;
            console.log(gs_command);
            if( file.length ) {
                exec(gs_command, function(err, stdout, stderr){
                    if (err) {
                        return res.send(err);
                    }
                    res.send('converted')
                });
            }

        });

    });

});

app.post('/api/convert', upload.single('file'), function(req, res) {
    docxPdfToImage.convert(
        req.body.type,
        req.file.destination,
        req.file.filename
    ).then( function (data) {
        console.log(data)
        res.status(200).json(data);
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
