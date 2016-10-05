import { combineReducers } from 'redux';
import todos from './todos';
import message from './message';
import header from './header';
import fetchCount from './fetchCount';

const todoApp = combineReducers({
    todos,
    message,
    header,
    fetchCount
});

export default todoApp;
