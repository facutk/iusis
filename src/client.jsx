import React from 'react';

import { render } from 'react-dom';
import { connect } from 'react-redux';

//import todoApp from './reducers';

import 'semantic-ui'; // CSS goes first, each component then overrides it with it's own style
import Layout from './components/Layout';
import Gaearon from './components/Gaearon';

import todoApp from './reducers'

let nextTodoId = 0;
const addTodo = (text) => {
    return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
    };
};
const setVisibilityFilter = (filter) => {
    return {
        type: 'SET_VISIBILITY_FILTER',
        filter
    };
};
const toggleTodo = (id) => {
    return {
        type: 'TOGGLE_TODO',
        id
    }
}

const Link = ({
    active,
    children,
    onClick
}) => {
    if (active) {
        return (
            <span>{children}</span>
        );
    }
    return (
        <a href='#'
            onClick={ e => {
                e.preventDefault();
                onClick();
            }}>
            {children}
        </a>
    );
}

const mapsStateToLinkProps = (
    state,
    ownProps
) => {
    return {
        active:
            ownProps.filter ===
            state.visibilityFilter
    };
};
const mapDispatchToLinkProps = (
    dispatch,
    ownProps
) => {
    return {
        onClick: ()=>{
            dispatch(
                setVisibilityFilter(ownProps.filter)
            );
        }
    };
};
const FilterLink = connect(
    mapsStateToLinkProps,
    mapDispatchToLinkProps
)(Link);



let AddTodo = ({ dispatch }) => {
    let input;

    return (
        <div>
            <input
                ref={node => {
                    input = node;
            }}/>
            <button
                onClick={ () => {
                    dispatch(addTodo(input.value));
                    input.value = '';
            }}>
                Add Todo
            </button>
        </div>
    );
}
AddTodo = connect()(AddTodo);

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

const Footer = () => (
    <p>
        Show:
        {' '}
        <FilterLink filter={'SHOW_ALL'}>
            All
        </FilterLink>
        {' '}
        <FilterLink filter={'SHOW_ACTIVE'}>
            Active
        </FilterLink>
        {' '}
        <FilterLink filter={'SHOW_COMPLETED'}>
            Completed
        </FilterLink>
    </p>
)

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

const mapStateToTodoListProps = (state) => {
    return {
        todos: getVisibleTodos(
            state.todos,
            state.visibilityFilter
        )
    };
};
const mapDispatchToTodoListProps = (dispatch) => {
    return {
        onTodoClick: (id) => {
            dispatch(toggleTodo(id));
        }

    };
};
const VisibleTodoList = connect(
    mapStateToTodoListProps,
    mapDispatchToTodoListProps
)(TodoList);

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

import { createStore } from 'redux';
import { Provider } from 'react-redux';
render (
    <Provider store={ createStore(todoApp, window.devToolsExtension && window.devToolsExtension()) }>
        <Layout />
    </Provider>,
    document.getElementById('root')
);



/*
render(
    <Provider store={ createStore(todoApp, window.devToolsExtension && window.devToolsExtension()) }>
        <Layout />
    </Provider>, document.getElementById('root')
);
*/

// service worker cache
if(process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install()
}
