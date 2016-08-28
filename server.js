require('babel-register');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static('dist'));

app.use('*',function(req,res){
    res.status(404).send('404');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
