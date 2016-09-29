var RequestClient = require("reqclient").RequestClient;
var fs = require('fs');

var client = new RequestClient({
    baseUrl: "https://iusis-soffice.herokuapp.com",
    debugRequest:true,
    debugResponse:true
});
client.post("api/convert",
    { "file": fs.createReadStream("sample/pandoc/droid.docx")},
    { "headers" : {"Content-Type": "multipart/form-data" } }
).then(function(data) {
    fs.writeFile("converted.pdf", data, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("pdf saved");
    });
}).catch(function(err) {
    console.error(err);
});

// esta bien subido?
// o el problema es cuando baja?
