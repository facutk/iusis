const fetchCount = (state = 0, action) => {
    switch (action.type) {
        case 'INC_FETCH_COUNT':
            return state + action.count;
        case 'DEC_FETCH_COUNT':
            return state - action.count;
        default:
            return state;
    }
};

export default fetchCount;
