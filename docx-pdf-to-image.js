var Promise = require('promise');
var exec = require('child_process').exec;
var fs = require('fs');

var typeCheck = function(params) {
    console.log('typeCheck');
    var supported_types = ['docx', 'pdf'];
    var promise = new Promise(function(resolve, reject) {
        if ( supported_types.indexOf(params.type) > -1 ) {
            resolve(params);
        }
        reject("file type " + params.type + " not supported");
   });
   return promise;
};

var docxToPdf = function(params) {
    console.log('docxToPdf');
    var promise = new Promise(function(resolve, reject) {
        if ( params.type === "pdf" ) {
            resolve(params); // pass thru
        } else {
            reject("docx not implemented yet");
            resolve(params);
        }
        /*
        exec
            resolve();
            reject();
        */
   });
   return promise;
}

var pdfToJpg = function(params) {
    console.log('pdfToJpg');
    var gs_command = "gs -dNOPAUSE -sDEVICE=jpeg -dBATCH -q -sOutputFile=" +
                     params.filename +
                     "%03d.jpg " +
                     params.filename;
    var promise = new Promise(function(resolve, reject) {
        console.log("converting pdf");

        exec(gs_command,
            { cwd: path },
            function(err, stdout, stderr) {
                if (err) {
                    reject( err );
                }
                resolve( params );
            }
        );

   });
   return promise;
}

var deleteOriginal = function(params) {
    console.log('deleteOriginal');
    var promise = new Promise(function(resolve, reject) {
        exec('rm ' + params.filename,
            function(err, stdout, stderr) {
                if (err) {
                    reject( err );
                }
                resolve( params );
            }
        );
        resolve(params);
   });
   return promise;
}

var listGenJpg = function(params) {
    console.log('listGenJpg');
    var promise = new Promise(function(resolve, reject) {
        exec('ls -la ' + params.path,
            function(err, stdout, stderr) {
                if (err) {
                    reject( err );
                }
                resolve( params );
            }
        );
   });
   return promise;
}

var compressJpg = function(params) {
    console.log('compressJpg');
    var promise = new Promise(function(resolve, reject) {
        resolve(params);
   });
   return promise;
}

var jpgToBase64 = function(params) {
    console.log('jpgToBase64');
    var promise = new Promise(function(resolve, reject) {
        resolve(params);
   });
   return promise;
}

var deleteJpg = function(params) {
    console.log('deleteJpg');
    var promise = new Promise(function(resolve, reject) {
        resolve(params);
   });
   return promise;
}

var bundleBase64 = function(params) {
    console.log('bundleBase64');
    var promise = new Promise(function(resolve, reject) {
        resolve(params);
   });
   return promise;
}

var handleError = function (error) {
    console.log(error);
}

var convert = function(type, path, filename) {
    return typeCheck({
        type: type,
        path: path,
        filename: filename
    }).then(docxToPdf)
    .then(pdfToJpg)
    .then(deleteOriginal)
    .then(listGenJpg)
    .then(compressJpg)
    .then(jpgToBase64)
    .then(deleteJpg)
    .then(bundleBase64);
    /*
    */
};

module.exports = {
    convert: convert
};
