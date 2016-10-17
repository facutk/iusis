import { v4 } from 'node-uuid';

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

export const onNodeMove = (sourceId, destinationId) => ({
    type: 'ON_NODE_MOVE',
    sourceId,
    destinationId
})

export const onNodeAdd = (parentNodeId, nodeId, nodeData) => ({
    type: 'ON_NODE_ADD',
    parentNodeId,
    nodeId,
    nodeData
})
