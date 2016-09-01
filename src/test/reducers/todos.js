import expect from 'expect';
import deepFreeze from 'deep-freeze';
import todos from '../../reducers/todos';

describe("todos reducer", function() {
    it("should add a todo", function() {
        const stateBefore = [];
        const action = {
            type: 'ADD_TODO',
            id: 0,
            text: 'Learn Redux'
        };
        const stateAfter = [
            {
                id: 0,
                text: 'Learn Redux',
                completed: false
            }
        ]

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(
            todos(stateBefore,action)
        ).toEqual(stateAfter);
    });
    it("should toggle a todo", function() {
        const stateBefore = [
            {
                id: 0,
                text: 'Learn Redux',
                completed: false
            },
            {
                id: 1,
                text: 'Go shopping',
                completed: false
            }
        ];
        const action = {
            type: 'TOGGLE_TODO',
            id: 1,
            text: 'Learn Redux'
        };
        const stateAfter = [
            {
                id: 0,
                text: 'Learn Redux',
                completed: false
            },
            {
                id: 1,
                text: 'Go shopping',
                completed: true
            }
        ]

        deepFreeze(stateBefore);
        deepFreeze(action);
        expect(
            todos(stateBefore,action)
        ).toEqual(stateAfter);
    });

});
