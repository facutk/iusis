import React from 'react';
import Header from './Header.jsx';
import PdfComposer from './PdfComposer.jsx';

const Footer = function() {
    return (
        <div className="ui inverse footer">
            <h1>footer!</h1>
        </div>
    );
}

const Layout = function() {
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
