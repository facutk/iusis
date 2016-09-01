import React from 'react';

import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

//import todoApp from './reducers';

import 'semantic-ui'; // CSS goes first, each component then overrides it with it's own style
import Layout from './components/Layout';
import Gaearon from './components/Gaearon';

import todoApp from './reducers'
const store = createStore(todoApp, window.devToolsExtension && window.devToolsExtension());

let nextTodoId = 0;

const FilterLink = ({
    filter,
    currentFilter,
    children
}) => {
    if (filter===currentFilter) {
        return (
            <span>{children}</span>
        );
    }
    return (
        <a href='#'
            onClick={ e => {
                e.preventDefault();
                store.dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter
                });
            }}>
            {children}
        </a>
    );
}

const getVisibleTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case 'SHOW_ALL':
            return todos;
        case 'SHOW_COMPLETED':
            return todos.filter(
                t => t.completed
            );
        case 'SHOW_ACTIVE':
            return todos.filter(
                t => !t.completed
            );
    }
}

const Todo = ({
    onClick,
    completed,
    text
}) => (
    <li
        onClick={onClick}
        style={{
            textDecoration:
                completed ?
                    'line-through' :
                    ''
        }}>
        {text}
    </li>
);

const TodoList = ({
    todos,
    onTodoClick
}) => (
    <ul>
        {todos.map(todo => (
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />
        ))}
    </ul>
);
class TodoApp extends React.Component {
    render() {
        const {
            todos,
            visibilityFilter
        } = this.props;
        const visibleTodos = getVisibleTodos(
            todos,
            visibilityFilter
        );
        return (
            <div>
                <input
                    ref={node => {
                        this.input = node;
                    }}/>
                <button
                    onClick={()=>{
                        store.dispatch({
                            type: 'ADD_TODO',
                            text: this.input.value,
                            id: nextTodoId++
                        });
                        this.input.value = '';
                    }
                }>
                    Add Todo
                </button>
                <TodoList
                    todos={visibleTodos}
                    onTodoClick={ id =>
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id: id
                        })
                    }
                />
                <p>
                    Show:
                    {' '}
                    <FilterLink
                        filter={'SHOW_ALL'}
                        currentFilter={visibilityFilter}
                    >
                        All
                    </FilterLink>
                    {' '}
                    <FilterLink
                        filter={'SHOW_ACTIVE'}
                        currentFilter={visibilityFilter}
                    >
                        Active
                    </FilterLink>
                    {' '}
                    <FilterLink
                        filter={'SHOW_COMPLETED'}
                        currentFilter={visibilityFilter}
                    >
                        Completed
                    </FilterLink>
                </p>
            </div>
        );
    }
}

/*
const myrender = () => {

    render (
        <TodoApp
            {...store.getState()}
        />,
        document.getElementById('root')
    );
}

store.subscribe(myrender)
myrender()
*/
render(
    <Provider store={ store }>
        <Layout />
    </Provider>, document.getElementById('root')
);

// service worker cache
if(process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install()
}
