//Initial axios to get country list and remove that pesky blackslash

const countries = (state = [], action) => {

    switch (action.type) {

        case 'GET_COUNTRIES':
            return [...action.payload.countries];
        case 'REMOVE_AUSTRALIA':
            return state.filter((item, index) => index !== action.payload)
        default: return state
    }
};

export default countries;