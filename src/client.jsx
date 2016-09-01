import React from 'react';

import { render } from 'react-dom';
import { Provider } from 'react-redux';
//import { createStore } from 'redux';

import counter from './reducers/counter'
//import todoApp from './reducers';

import 'semantic-ui'; // CSS goes first, each component then overrides it with it's own style
import Layout from './components/Layout';
import Gaearon from './components/Gaearon';


const createStore = (reducer, optional) => {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter( l => l !== listener );
        }
    }

    dispatch({});

    return { getState, dispatch, subscribe };
}


const store = createStore(counter, window.devToolsExtension && window.devToolsExtension());

store.subscribe(() => {
    document.body.innerText = store.getState()
})
document.addEventListener('click', ()=>{
    store.dispatch({type: 'INCREMENT'});
})

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
