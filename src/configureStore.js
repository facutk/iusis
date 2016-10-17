import { createStore } from 'redux';
import todoApp from './reducers'

const configureStore = () => {
    const store = createStore(todoApp, window.devToolsExtension && window.devToolsExtension());
    return store;
};

export default configureStore;
