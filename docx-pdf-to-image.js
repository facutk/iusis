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
                     params.path + params.filename +
                     "%03d.jpg " +
                     params.path + params.filename;
    var promise = new Promise(function(resolve, reject) {
        console.log("converting pdf");
        console.log(gs_command);

        exec(gs_command, function(err, stdout, stderr) {
            console.log(stdout);
            if (err) {
                console.log(err);
                reject( err );
            }
            resolve( params );
        });

   });
   return promise;
}

var listGenJpg = function(params) {
    console.log('listGenJpg');
    var promise = new Promise(function(resolve, reject) {

        fs.readdir(params.path, function (err, files) {

            console.log('err: ', err);
            console.log('files: ', files);

            if (err) reject(err);

            params.images = files.filter(function(file){
                // return only files generated from current original file
                return file.substr(-4) === ".jpg" &&
                    params.filename.indexOf(file);
            });
            console.log(params.images);
            resolve( params );
        });

   });
   return promise;
}

var compressJpg = function(params) {
    console.log('compressJpg');
    console.log(params)
    var promise = new Promise(function(resolve, reject) {
        resolve(params);
   });
   return promise;
}

var readFileToMemory = function(file) {
    var promise = new Promise(function(resolve, reject) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
    return promise;
}

var loadJpgsToMemory = function(params) {
    console.log('loadJpgsToMemory');
    console.log(params);
    var promise = new Promise(function(resolve, reject) {

        Promise.all(params.images.map(function(image) {
            return readFileToMemory(params.path + image);
        }))
        .then(function(loadedImages) {
            params.loadedImages = loadedImages;
            resolve(params);
        })
        .catch(function(err) {
            reject(err);
        });

   });
   return promise;
}

var deleteFile = function(file) {
    var promise = new Promise(function(resolve, reject) {
        console.log('delete: ', file);
        fs.unlink(file,function(err){
            if(err) reject( err );

            resolve( 'deleted' );
        });

   });
   return promise;
}

var deleteOriginalFile = function(params) {
    console.log('deleteOriginalFile');
    var promise = new Promise(function(resolve, reject) {
        deleteFile(params.path + params.filename).then(function (msg) {
            console.log(params);
            resolve( params );
        }).catch(function(err) {
            reject(err);
        })
   });
   return promise;
}

var deleteJpgs = function(params) {
    console.log('deleteJpgs');
    console.log(params);
    var promise = new Promise(function(resolve, reject) {

        Promise.all(params.images.map(function(image) {
            return deleteFile(params.path + image);
        }))
        .then(function(msg) {
            resolve(params);
        })
        .catch(function(err) {
            reject(err);
        });

   });
   return promise;
}

var bundleBase64 = function(params) {
    console.log('bundleBase64');
    var promise = new Promise(function(resolve, reject) {

        if (params.loadedImages.length === 0) reject('no files converted');

        resolve(params.loadedImages.map(function(loadedImage){
            return (new Buffer(loadedImage)).toString('base64');
        }));

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
    .then(listGenJpg)
    .then(compressJpg)
    .then(loadJpgsToMemory)
    .then(deleteOriginalFile)
    .then(deleteJpgs)
    .then(bundleBase64);

};

module.exports = {
    convert: convert
};
