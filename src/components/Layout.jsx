import React from 'react';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import PdfComposer from './PdfComposer.jsx';

const Layout = function() {
    return (
        <div>
            <div className="ui left vertical inverted visible sidebar menu">
                <PdfComposer />
                <Sidebar />
            </div>
            <div className="pusher">
                <Header />

            </div>
        </div>
    );
}

const Layout2 = function() {
    //<div className="ui dimmer active"></div>
    return (
        <div>
            <div style={{
                    backgroundColor: '#21252B',
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 320,
                    overflow: 'auto',
                    overflow: 'initial',
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}>
                <Sidebar />
            </div>
            <div style={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 320,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    zIndex: 9999
                }}>
                <Header />
                <PdfComposer />
                <button className="ui icon button"><i className="sidebar icon"></i></button>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
                <p>contenido</p>
            </div>
        </div>
    );
}


const Layout3 = function() {
    //<div className="ui dimmer active"></div>
    return (
        <div>
            <div style={{
                    backgroundColor: 'red',
                    color: 'white',
                    display: 'block',
                    marginBottom: 4,
                    padding: 5,
                    minHeight: 100
                }}>
                header
            </div>

            <div style={{
                display: '-webkit-flex',
                display: 'flex',
                flexFlow: 'row',
                minHeight: 600
            }}>
                <div style={{
                        backgroundColor: 'green',
                        color: 'white',
                        margin: 4,
                        padding: 5,
                        minWidth: 312,
                        flexBasis: 'auto',
                        flexGrow: 1,
                        order: 1
                    }}>
                    sidebar
                </div>

                <div style={{
                        backgroundColor: 'blue',
                        color: 'white',
                        margin: 4,
                        padding: 5,
                        flexGrow: 3,
                        order: 2
                    }}>
                    content
                </div>
            </div>
        </div>
    );
}

export default Layout3;
