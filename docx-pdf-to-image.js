var Promise = require('promise');

var convert = function(type, folder, filename) {
  return new Promise( function(resolve, reject){

      reject('error loco!');
      //resolve('todo ok!');
  });
};
module.exports = {
    convert: convert
};
