var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var multer = require('multer');
var upload = multer( { dest: '/tmp/' } );

var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(request, response) {
  response.send('hello node');
});

app.post('/api/convert', upload.single('file'), function(req, res) {

    res.status(200).json(req.file);
    //res.status(500).json({ error: error });

});

app.use('*',function(req,res){
    res.status(404).send('404');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
