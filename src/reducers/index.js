import { combineReducers } from 'redux';
import header from './header';
import fetchCount from './fetchCount';
import tree from './tree';

const todoApp = combineReducers({
    header,
    fetchCount,
    tree
});

export default todoApp;
