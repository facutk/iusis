import expect from 'expect';
import counter from '../src/reducers/counter';

describe("counter reducer", function() {
    it("should change 0 to 1 on INCREMENT", function() {
        expect(
            counter(0,{ type: 'INCREMENT'})
        ).toEqual(1);
    });

    it("should change 1 to 2 on INCREMENT", function() {
        expect(
            counter(1, { type: 'INCREMENT'})
        ).toEqual(2);
    });

    it("should change 2 to 1 on DECREMENT", function() {
        expect(
            counter(2, { type: 'DECREMENT' })
        ).toEqual(1);
    });

    it("should change 1 to 0 on DECREMENT", function() {
        expect(
            counter(1, { type: 'DECREMENT' })
        ).toEqual(0);
    });

    it("should return the same on unknown action", function() {
        expect(
            counter(1, { type: 'SOMETHING_ELSE' })
        ).toEqual(1);
    });

    it("should return initial state on undefined", function() {
        expect(
            counter(undefined, {})
        ).toEqual(0);
    });

});
