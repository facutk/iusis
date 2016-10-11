import { combineReducers } from 'redux';
import todos from './todos';
import header from './header';
import fetchCount from './fetchCount';
import tree from './tree';

const todoApp = combineReducers({
    todos,
    header,
    fetchCount,
    tree
});

export default todoApp;
