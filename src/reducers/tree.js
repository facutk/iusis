const defaultTree = {
    0: { id: 0, module: 'PDF', children: [] }
}

const defaultTree2 = {
    0: { id: 0, module: 'PDF', children: [1, 6, 11, 12, 13, 14, 15, 16, 17] },
    1: { id: 1, module: 'dist', children: [2, 3, 4, 5], collapsed: true },
    2: { id: 2, module: 'action.js', children: [] },
    3: { id: 3, module: 'react-ui-tree.css', children: [] },
    4: { id: 4, module: 'react-ui-tree.js', children: [] },
    5: { id: 5, module: 'tree.js', children: [] },
    6: { id: 6, module: 'lib', children: [7, 8, 9, 10] },
    7: { id: 7, module: 'node.js', children: [] },
    8: { id: 8, module: 'react-ui-tree.js', children: [] },
    9: { id: 9, module: 'react-ui-tree.less', children: [] },
    10: { id: 10, module: 'tree.js', children: [] },
    11: { id: 11, module: '.gitiignore', children: [] },
    12: { id: 12, module: 'index.js', children: [] },
    13: { id: 13, module: 'LICENSE', children: [] },
    14: { id: 14, module: 'Makefile', children: [] },
    15: { id: 15, module: 'package.json', children: [] },
    16: { id: 16, module: 'README.md', children: [] },
    17: { id: 17, module: 'webpack.config.js', children: [] }
};


const tree = (state = defaultTree2, action) => {
    switch (action.type) {
        case 'TOGGLE_ACTIVE_NODE':
            return Object.keys(state).reduce( (reducedTree, nodeId) => {
                reducedTree[nodeId] = {
                    ...state[nodeId],
                    active: ( nodeId == action.nodeId )
                }
                return reducedTree
            }, {})
        case 'TOGGLE_COLLAPSED_NODE':
            return {
                ...state,
                [action.nodeId]: {
                    ...state[action.nodeId],
                    collapsed: !state[action.nodeId].collapsed
                }
            }
        case 'ON_NODE_MOVE':
            const findParent = (nodeId, tree) => {
                for (const id of Object.keys(tree)) {
                    if ( tree[id].children.indexOf(nodeId) > -1 ) return id;
                }
                return 0;
            }

            // delete node
            const parentFrom = findParent(action.sourceId, state)
            const newFrom = state[parentFrom].children.filter( childId => {
                return childId != action.sourceId
            })

            const newStateNodeRemoved = Object.keys(state).reduce( (reducedTree, nodeId) => {
                reducedTree[nodeId] = {
                    ...state[nodeId],
                    children: state[nodeId].children.filter( childId => {
                        return childId != action.sourceId
                    })
                }
                return reducedTree
            }, {})
            //return newStateNodeRemoved

            //console.log(newStateNodeRemoved)

            // insert node
            let parentTo = 0
            let newToIndex = 0
            if ( newStateNodeRemoved[action.destinationId].children.length ) {
                parentTo = action.destinationId
                newToIndex = 0
            } else {
                parentTo = findParent(action.destinationId, newStateNodeRemoved)
                newToIndex = newStateNodeRemoved[parentTo].children.indexOf(action.destinationId) + 1
            }

            const newTo = [
                ...newStateNodeRemoved[parentTo].children.slice(0, newToIndex),
                action.sourceId,
                ...newStateNodeRemoved[parentTo].children.slice(newToIndex, newStateNodeRemoved[parentTo].children.length)
            ]

            const newStateNodeAdded = Object.keys(newStateNodeRemoved).reduce( (reducedTree, nodeId) => {
                reducedTree[nodeId] = {
                    ...newStateNodeRemoved[nodeId],
                    children: (nodeId == parentTo) ? newTo : newStateNodeRemoved[nodeId].children
                }
                return reducedTree
            }, {})
            //console.log( newStateNodeAdded )
            return newStateNodeAdded
            //console.log(newTo)
            //console.log( newFrom, action.sourceId, state[parentTo].children, action.destinationId, newToIndex, newTo )

            //console.log(action.sourceId, action.destinationId)
            return state
        case 'ON_NODE_ADD':
            //console.log( action )
            //console.log(state)
            const newState = Object.keys(state).reduce( (reducedTree, nodeId) => {
                reducedTree[nodeId] = {
                    ...state[nodeId],
                    children: (nodeId == action.parentNodeId) ?
                        state[nodeId].children.concat(action.nodeId) :
                        state[nodeId].children
                }
                return reducedTree
            }, {})
            //console.log( newState )

            newState[action.nodeId] = {
                id: action.nodeId,
                module: action.nodeData.name,
                children: []
            }
            return newState
        default:
            return state
    }
}

export default tree
