import React from 'react';
import PdfComposer from './PdfComposer.jsx';

const Header = function() {
    return (
        <div>
            <h1 className="ui header">I U S I S</h1>
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
