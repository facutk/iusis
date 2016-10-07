import { v4 } from 'node-uuid';

export const addTodo = (text) => ({
    type: 'ADD_TODO',
    id: v4(),
    text
});

export const toggleTodo = (id) => ({
    type: 'TOGGLE_TODO',
    id
});

export const setMessage = (message) => ({
    type: 'SET_MESSAGE',
    message
});

export const setHeader = (header) => ({
    type: 'SET_HEADER',
    header
});


export const incFetchCount = () => ({
    type: 'INC_FETCH_COUNT',
    count: 1
});

export const decFetchCount = () => ({
    type: 'DEC_FETCH_COUNT',
    count: 1
});


export const toggleCollapsedNode = (nodeId) => ({
    type: 'TOGGLE_COLLAPSED_NODE',
    nodeId
})

export const toggleActiveNode = (nodeId) => ({
    type: 'TOGGLE_ACTIVE_NODE',
    nodeId
})
