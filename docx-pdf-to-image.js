var Promise = require('promise');
var exec = require('child_process').exec;
var fs = require('fs');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var RequestClient = require("reqclient").RequestClient;

var typeCheck = function(params) {
    console.log('typeCheck');
    var supported_types = ['docx', 'doc', 'pdf'];
    var promise = new Promise(function(resolve, reject) {
        if ( supported_types.indexOf(params.type) > -1 ) {
            return resolve(params);
        }
        reject("file type " + params.type + " not supported");
   });
   return promise;
};

var docxToPdf = function(params) {
    console.log('docxToPdf');
    var promise = new Promise(function(resolve, reject) {
        if ( params.type === "pdf" ) {
            return resolve(params); // pass thru
        } else {

            var client = new RequestClient({
                baseUrl: "https://iusis-soffice.herokuapp.com",
                debugRequest:true,
                debugResponse:true
            });
            client.post("/api/convert", {
                "file": fs/createReadStream(params.path + params.filename)}, {
                "headers" : {"Content-Type": "multipart/form-data"}
            }).then(function(data) {
                console.log(data);
                resolve(params);
            }).catch(function(err) {
                console.error(err);
                reject( err );
            });

        }
   });
   return promise;
}

var pdfToJpg = function(params) {
    console.log('pdfToJpg');

    var gs_command = "gs -dNOPAUSE -sDEVICE=jpeg -dBATCH -q -r150 " +
                     "-dINTERPOLATE " +
                     "-sOutputFile=" + params.path + params.filename +
                     "%03d.jpg " +
                     params.path + params.filename;

    var promise = new Promise(function(resolve, reject) {
        console.log("converting pdf");
        console.log(gs_command);

        exec(gs_command, function(err, stdout, stderr) {
            console.log(stdout);
            if (err) {
                console.log(err);
                return reject( err );
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

            if (err) return reject(err);

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

        var imagesInPath = params.images.map(function(image){
            return params.path + image;
        });
        imagemin(imagesInPath, params.path, {
            plugins: [
                imageminMozjpeg()
            ]
        }).then(function(files) {
            console.log("compressed");
            resolve(params);
        }).catch(function(error){
            console.log(error);
            reject(error);
        });


   });
   return promise;
}

var readFileAsB64 = function(file) {
    var promise = new Promise(function(resolve, reject) {
        fs.readFile(file, 'base64', function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
    return promise;
}

var loadJpgsAsB64 = function(params) {
    console.log('loadJpgsAsB64');
    console.log(params);
    var promise = new Promise(function(resolve, reject) {

        Promise.all(params.images.map(function(image) {
            return readFileAsB64(params.path + image);
        }))
        .then(function(b64images) {
            params.b64images = b64images;
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
            //if(err) return reject( err );
            resolve( 'deleted' );
        });
   });
   return promise;
}

var deleteDocx = function(params) {
    console.log('deleteDocx');
    var promise = new Promise(function(resolve, reject) {
        deleteFile(params.path + params.filename).then(function (msg) {
            params.filename = params.filename + '.pdf';
            resolve( params );
        });
   });
   return promise;
}

var deletePdf = function(params) {
    console.log('deletePdf');
    var promise = new Promise(function(resolve, reject) {
        deleteFile(params.path + params.filename).then(function (msg) {
            resolve( params );
        });
   });
   return promise;
}

var deleteJpgs = function(params) {
    console.log('deleteJpgs');
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

var mapOutput = function(params) {
    console.log('mapOutput');
    var promise = new Promise(function(resolve, reject) {

        if (params.b64images.length === 0) return reject('no files converted');

        resolve(params.b64images.map(function(b64image){
            return b64image;
        }));

   });
   return promise;
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
    .then(loadJpgsAsB64)
    .then(deleteDocx)
    .then(deletePdf)
    .then(deleteJpgs)
    .then(mapOutput);
};

module.exports = {
    convert: convert
};
