import React from 'react';

import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import todoApp from './reducers';

import 'semantic-ui'; // CSS goes first, each component then overrides it with it's own style
import Layout from './components/Layout';
import Gaearon from './components/Gaearon';


const store = createStore(todoApp, window.devToolsExtension && window.devToolsExtension());

render(
    <Provider store={ store }>
        <Layout />
    </Provider>,
    document.getElementById('root')
);

// service worker cache
if(process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install()
}
