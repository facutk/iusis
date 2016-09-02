import React from 'react';

import { render } from 'react-dom';
import { Provider } from 'react-redux';

//import todoApp from './reducers';

import 'semantic-ui'; // CSS goes first, each component then overrides it with it's own style
import Layout from './components/Layout';
import Gaearon from './components/Gaearon';

import todoApp from './reducers'

let nextTodoId = 0;

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

class FilterLink extends React.Component {
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe( () => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render () {
        const { store } = this.props;
        const props = this.props;
        const state = store.getState();

        return (
            <Link
                active={
                    props.filter ===
                    state.visibilityFilter
                }
                onClick={()=>{
                    store.dispatch({
                        type: 'SET_VISIBILITY_FILTER',
                        filter: props.filter
                    })
            }}>
                {props.children}
            </Link>
        )
    }
}

const AddTodo = ({ store }) => {
    let input;

    return (
        <div>
            <input
                ref={node => {
                    input = node;
            }}/>
            <button
                onClick={ () => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        id: nextTodoId++,
                        text: input.value
                    })
                    input.value = '';
            }}>
                Add Todo
            </button>
        </div>
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

const Footer = ({ store }) => (
    <p>
        Show:
        {' '}
        <FilterLink
            filter={'SHOW_ALL'}
            store={store}
        >
            All
        </FilterLink>
        {' '}
        <FilterLink
            filter={'SHOW_ACTIVE'}
            store={store}
        >
            Active
        </FilterLink>
        {' '}
        <FilterLink
            filter={'SHOW_COMPLETED'}
            store={store}
        >
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

class VisibleTodoList extends React.Component {
    componentDidMount() {
        const { store } = this.props;
        this.unsubscribe = store.subscribe( () => {
            this.forceUpdate()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render () {
        const props = this.props;
        const { store } = props;
        const state = store.getState();

        return (
            <TodoList
                todos={
                    getVisibleTodos(
                        state.todos,
                        state.visibilityFilter
                    )
                }
                onTodoClick={id=>{
                    store.dispatch({
                        type: 'TOGGLE_TODO',
                        id
                    })
            }}/>
        )
    }
}

const TodoApp = ({store}) => (
    <div>
        <AddTodo store={store} />
        <VisibleTodoList store={store} />
        <Footer store={store} />
    </div>
);


import { createStore } from 'redux';

/*
render (
    <TodoApp store={ createStore(todoApp, window.devToolsExtension && window.devToolsExtension()) } />,
    document.getElementById('root')
);

*/


render(
    <Provider store={ createStore(todoApp, window.devToolsExtension && window.devToolsExtension()) }>
        <Layout />
    </Provider>, document.getElementById('root')
);

// service worker cache
if(process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install()
}
