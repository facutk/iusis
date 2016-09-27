import React from 'react';
import PdfComposer from './PdfComposer.jsx';
import './Layout.scss';

const Header = function() {
    return (
        <div className="ui header nav">
            <h1>I U S I S</h1>
        </div>
    );
}

const Footer = function() {
    return (
        <div className="ui inverse footer">
            <h1>footer!</h1>
        </div>
    );
}

const Layout = function() {
    var img = new Image();
    img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
            var url = window.URL.createObjectURL(blob);
            console.log(url);
        });
    };
    img.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAQI/8QAHhAAAgIDAAMBAAAAAAAAAAAAAQIDBAUGEQASEyH/xAAVAQEBAAAAAAAAAAAAAAAAAAAFBv/EACERAAEDAQkAAAAAAAAAAAAAABEAARIxAwQTFCFhcaHw/9oADAMBAAIRAxEAPwDeW478Vu0J7gyz4y5sC69VrYiZoSr+7xvYmdSG9A8bjgIAAH4SfGnb8Wu356YyyYynsDa9arZeZpSz+6RpYhdizeheRBwkggn8BHkm1Y7YdLyNpaTZAUJ7li7Wt0cY+RjH2f6SQzwRn6dEhYqy8HDzvejxquO2HdMjVW62QNCG5Xu2bd7GPjoz8X+kcMEEh+nTIFLM3Rwc6TweRc75nIQcmo0HNBsmRZYRLD3a/9k=";

    return (
        <div>
            <Header />
            <div className="ui main text container">
                <PdfComposer />
            </div>
        </div>
    );
}

export default Layout;
