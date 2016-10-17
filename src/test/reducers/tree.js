import expect from 'expect';
import deepFreeze from 'deep-freeze';
import tree from '../../reducers/tree';

describe("tree reducer", function() {
    it("should add a node", function() {
        const stateBefore = {
            0: { id: 0, module: 'PDF', children: [] }
        };
        const action = {
            type: 'ON_NODE_ADD',
            parentNodeId: 0,
            nodeId: 1,
            nodeData: { name: 'test' }
        };
        const stateAfter = {
            0: { id: 0, module: 'PDF', children: [1] },
            1: { id: 1, module: 'test', children: [] }
        }

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(
            tree(stateBefore,action)
        ).toEqual(stateAfter);
    });

});
