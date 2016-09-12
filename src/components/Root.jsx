import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';
import Layout from './Layout';

const Root = ({ store }) => (
    <Provider store={ store }>
        <Router history={ browserHistory }>
            <Route path='/(:filter)' component={ Layout } />
        </Router>
    </Provider>
);

export default Root;
