import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import 'semantic-ui';

import Layout from './Layout.jsx';


const userReducer = (state = [], action) => {
    return state;
};
const pdfComposerReducer = (state = [], action) => {
    return state;
};

const reducer = combineReducers({
    user: userReducer,
    pdfComposer: pdfComposerReducer
});

render(
    <Provider store={ createStore(reducer, window.devToolsExtension && window.devToolsExtension()) }>
        <Layout />
    </Provider>,
    document.getElementById('root')
);
