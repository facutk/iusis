const defaultTree = {
    0: { id: 0, module: 'PDF', children: [] }
}

const defaultTree2 = {
    0: { id: 0, module: 'PDF', children: [1, 6, 11, 12, 13, 14, 15, 16, 17] },
    1: { id: 1, module: 'dist', children: [2, 3, 4, 5], collapsed: true },
    2: { id: 2, module: 'node.js', children: [] },
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
        default:
            return state
    }
}

export default tree
