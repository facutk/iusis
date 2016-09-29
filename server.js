var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var upload = multer( { dest: '/tmp/' } );
var exec = require('child_process').exec;
var fs = require('fs');

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(request, response) {
  response.send('hello node');
});

app.post('/api/convert', upload.single('file'), function(req, res) {

    var path = "/tmp/";
    var filename = req.file.filename;
    var soffice_command = "soffice --headless --convert-to pdf " +
        path + filename + " --outdir " + path;

    exec(soffice_command, function(err, stdout, stderr) {
        console.log(stdout);
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.sendFile(path + filename + ".pdf", function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', fileName);
            }
            fs.unlink( path + filename );
            fs.unlink( path + filename  + ".pdf" );
        });

    });

});

app.use('*',function(req,res){
    res.status(404).send('404');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
