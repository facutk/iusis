var Promise = require('promise');
var exec = require('child_process').exec;
var fs = require('fs');


var firstMethod = function() {
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
         console.log('first method completed');
         resolve({data: '123'});
      }, 2000);
   });
   return promise;
};


var secondMethod = function(someStuff) {
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
         console.log('second method completed');
         resolve({newData: someStuff.data + ' some more data'});
      }, 2000);
   });
   return promise;
};

var thirdMethod = function(someStuff) {
   var promise = new Promise(function(resolve, reject){
      setTimeout(function() {
         console.log('third method completed');
         resolve({result: someStuff.newData});
      }, 3000);
   });
   return promise;
};

firstMethod()
   .then(secondMethod)
   .then(thirdMethod);

var pdf_to_jpg = function(folder, filename) {
    var gs_command = "gs -dNOPAUSE -sDEVICE=jpeg -dBATCH -q -sOutputFile=" +
                     filename +
                     "%03d.jpg " +
                     filename;

    var promise = new Promise( function(resolve, reject) {
        exec(gs_command,
            { cwd: folder },
            function(err, stdout, stderr) {
                if (err) {
                    reject( err );
                }
                resolve( stdout );
            }
        );
    }
    return promise;
}

var docx_to_pdf = function(params) {
    var pandoc_command = "ls -la";

    var promise = new Promise(function(resolve, reject) {
        exec(pandoc_command,
            { cwd: folder },
            function(err, stdout, stderr) {
                if (err) {
                    reject( err );
                }
                resolve( stdout );
            }
        );
    });
    return promise;
}

var convertDocx = function(params) {
    return docx_to_pdf(params)
        .then(convertPdf);
}

var convertPdf = function(folder, filename) {
    return pdf_to_jpg(folder, filename)
        .then(list_generated_images)
        .then(compress_images)
        .then(read_images)
        .then(delete_images)
        .then(reduce_images);
}

var dispatch_conversion = function(params) {

}

var convert = function(type, folder, filename) {
    return dispatch_conversion({
        type: type,
        folder: folder,
        filename: filename
    });
    return new Promise( function(resolve, reject) {
        switch (type) {
            case pdf:
                resolve( convertPdf(folder, filename) );
                break;
            case docx:
                resolve( convertDocx(folder, filename) );
                break;
            default:
                reject('Conversion type not implemented.');
                break;
        }
    });
};
module.exports = {
    convert: convert
};
