var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var upload = multer( { dest: '/tmp/' } );
var exec = require('child_process').exec;
var fs = require('fs');

var app = express();
var secret_token = process.env.soffice_auth_token || 'iusus';

app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(request, response) {
  response.send('hello node');
});

app.post('/api/convert', upload.single('file'), function(req, res) {

    var secret_token = process.env.soffice_auth_token || 'iusus';

    if (req.body.auth != secret_token) {
        console.log('wrong auth!');
        fs.unlink(__dirname + '/' + req.file.filename);
        return res.status(403).json({ error: 'wrong auth token'}).end();
    }

    var path = "/tmp";
    var filename = req.file.filename;
    var soffice_command = "soffice --headless --convert-to pdf " +
        path + '/' + filename + " --outdir " + path;

    exec(soffice_command, function(err, stdout, stderr) {
        console.log(stdout);
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.sendFile(path + '/' + filename + ".pdf", function (err) {
            console.log('Sent:', path + '/' + filename);

            fs.unlink( path + '/' + filename );
            fs.unlink( path + '/' + filename  + ".pdf" );
        });

    });

});

app.use('*',function(req,res){
    res.status(404).send('404');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
