import { combineReducers } from 'redux';
import todos from './todos';
import message from './message';
import header from './header';
import fetchCount from './fetchCount';
import tree from './tree';

const todoApp = combineReducers({
    todos,
    message,
    header,
    fetchCount,
    tree
});

export default todoApp;
