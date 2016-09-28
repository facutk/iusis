//https://github.com/mrsarm/reqclient
var RequestClient = require("reqclient").RequestClient;

var client = new RequestClient({
    baseUrl: "https://iusis-soffice.herokuapp.com/",
    debugRequest:true,
    debugResponse:true
});
client.get("")
 .then(function(response) {
    console.log(response);  // REST responses are parsed as JSON objects
  })
    .catch(function(err) {
    console.error(err);
  });

