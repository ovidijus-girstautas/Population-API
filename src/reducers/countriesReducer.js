const countries = (state = [], action) => {

    switch (action.type) {

        case 'GET_COUNTRIES':
            return [...action.payload];
        case 'REMOVE_AUSTRALIA':
            return state.filter((item, index) => index !== action.payload);
        case 'SORT_BY_NAME':
            return state.slice().sort(function (a, b) {
                var nameA = a.country.toLowerCase(),
                    nameB = b.country.toLowerCase()
                if (nameA < nameB)
                    return -1
                if (nameA > nameB)
                    return 1
                return 0
            });
        case 'SORT_BY_POPULATION':
            return state.slice().sort(function (a, b) {
                return b.totalPopulation - a.totalPopulation;
            });
        default: return state
    }
};

export default countries;