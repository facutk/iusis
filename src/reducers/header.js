const header = (state = '', action) => {
    switch (action.type) {
        case 'SET_HEADER':
            return action.header;
        default:
            return state;
    }
};

export default header;
