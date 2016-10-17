import React from 'react';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import PdfComposer from './PdfComposer.jsx';

const Layout = function() {
    return (
        <div>
            <Header />
            <div className="ui stackable column grid">
                <div className="six wide column sidebar">
                    <Sidebar />
                </div>
                <div className="ten wide column">
                    <PdfComposer />
                </div>
            </div>
        </div>
    );
}

export default Layout;
