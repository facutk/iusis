import 'babel-polyfill';
import 'semantic-ui'; // CSS goes first, each component then overrides it with it's own style

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import todoApp from './reducers'
import App from './components/App';

import Layout from './components/Layout';

render (
    <Provider store={ createStore(todoApp, window.devToolsExtension && window.devToolsExtension()) }>
        <Layout />
    </Provider>,
    document.getElementById('root')
);


// service worker cache
if(process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install()
}
