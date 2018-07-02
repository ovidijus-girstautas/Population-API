import axios from 'axios';

export function fetchCountryList() {
    return async function (dispatch) {
        try{
            axios.get('http://api.population.io/1.0/countries')
                .then((response) => {
                    dispatch({
                        type: 'GET_COUNTRIES',
                        payload: response.data
                    })
                })
                .then(() => {
                    dispatch({
                        type: 'REMOVE_AUSTRALIA',
                        payload: 12
                    })
                })
        } catch (err) {
            console.log('try failed');
        }
        
    }
}

export function getInfo(countries) {
    return ({
        type: 'GET_INFO',
        payload: countries
    })
}

export function sortByName() {
    return ({
        type: 'SORT_BY_NAME'
    })
}

export function sortByPopulation() {
    return ({
        type: 'SORT_BY_POPULATION'
    })
}