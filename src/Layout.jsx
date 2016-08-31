import React from 'react';
import PdfComposer from './PdfComposer.jsx';

const Header = function() {
    var headerStyle = {
        backgroundColor: '#2185d0',
        color: '#fff',
        padding: '0.25em',
        marginBottom: '1em'
    }
    return (
        <div>
            <h1 style={headerStyle} className="ui header">I U S I S</h1>
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
