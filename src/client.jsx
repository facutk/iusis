import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import 'semantic-ui';

import Layout from './Layout.jsx';


const countersReducer = (state = [], action) => {
    return state;
};
const productsReducer = (state = [], action) => {
    return state;
};

const reducer = combineReducers({
    counters: countersReducer,
    products: productsReducer
});

let store = createStore(reducer, window.devToolsExtension && window.devToolsExtension());

render(
    <Provider store={store}>
        <Layout />
    </Provider>,
    document.getElementById('root')
);
