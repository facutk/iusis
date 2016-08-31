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
