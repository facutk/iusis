import 'babel-polyfill';
import 'semantic-ui'; // CSS goes first, each component then overrides it with it's own style

import React from 'react';
import { render } from 'react-dom';
import configureStore from './configureStore';
import Root from './components/Root';

const store = configureStore();

render (
    <Root store={ store } />,
    document.getElementById('root')
);


// service worker cache
if(process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install()
}
