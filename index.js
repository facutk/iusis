/*
var phantom = require('phantom');

phantom.create(function (ph) {
    ph.createPage(function (page) {
        page.open("http://www.google.com", function (status) {

            var paperConfig = {
                format: 'A4',
                orientation: 'portrait',
                border: '1cm',
                header: {
                    height: '1cm',
                    contents: ph.callback(function(pageNum, numPages) {
                        return '<h1>My Custom Header</h1>';
                    })
                },
                footer: {
                    height: '1cm',
                    contents: ph.callback(function(pageNum, numPages) {
                        return '<p>Page ' + pageNum + ' / ' + numPages + '</p>';
                    })
                }
            };

            page.set('paperSize', paperConfig, function() {
                // render to pdf
                page.render('page.pdf', function() {
                    page.close();
                    ph.exit();
                });
            });
        });
    });
});
*/

var phantom = require("phantom");
var _ph, _page, _outObj;

phantom.create().then(ph => {
    _ph = ph;
    return _ph.createPage();
}).then(page => {
    _page = page;
    _page.paperSize = {
        format: 'A4',
        orientation: 'portrait',
        margin: '15cm'
    };
    _page.viewportSize = {
        width: 100,
        height: 100,
    };
    _page.property('paperSize', {format: 'A4', orientation: 'portrait', margin: '1cm'});
    _page.property('paperSize').then( function(content) {
        console.log( content );
    });
    //return _page.open('https://secret-sierra-35258.herokuapp.com/');
    return _page.open('https://secret-sierra-35258.herokuapp.com/');
}).then(status => {
    console.log(status);
    _page.render('page.pdf');
    return _page.property('content')
}).then(content => {
    console.log(content);
    _page.close();
    _ph.exit();
}).catch(e => console.log(e));
