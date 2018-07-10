import axios from 'axios';
import _ from "lodash";

export function fetchCountryList() {
    return async function (dispatch) {
        const countries = [];
        const population = [];
        const allCountries = [];
        try{
            axios.get('http://api.population.io/1.0/countries')
                .then((response) => {
                    const ignore = ['Australia/New Zealand', 'ASIA', 'AFRICA', 'EUROPE', 'World', "Less developed regions", "Less developed regions, excluding China", "Less developed regions, excluding least developed countries", 'Least developed countries', 'More developed regions', 'LATIN AMERICA AND THE CARIBBEAN', 'NORTHERN AMERICA', 'South-Central Asia', 'Southern Asia', 'Eastern Asia', 'Sub-Saharan Africa', 'South-Eastern Asia', 'South America', 'Eastern Africa', 'Western Africa', 'Eastern Europe', 'Western Asia', 'Northern Africa', 'Western Europe', 'Central America', 'Middle Africa', 'Southern Europe', 'Northern Europe', 'Central Asia', 'Southern Africa', 'South Africa', 'OCEANIA']
                    response.data.countries.forEach((list, i) => {
                        if (!_.includes(ignore, list)) {
                            const obj = { country: list}
                            countries.push(obj)
                        }
                    });
                })
                .then(()=>{
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getFullYear();
                    if (dd < 10) {dd = '0' + dd}
                    if (mm < 10) {mm = '0' + mm}
                    today = yyyy + '-' + mm + '-' + dd;

                    let promises = [];

                    for (let i = 0; i < countries.length; i++) {
                        promises.push(axios.get('http://api.population.io/1.0/population/' + countries[i].country + '/' + today + '/'))
                    }
                    axios.all(promises)
                    .then(results=>{
                        results.forEach((item, i)=>{
                            const object = {population: item.data.total_population.population}
                            population.push(object);
                        })
                    })
                    .then(results=>{
                        var today = new Date();
                        var year = today.getFullYear();

                        let promiseArray = countries.map((country, i) => axios.get('http://api.population.io/1.0/population/' + year + '/' + countries[i].country + '/'))
                        Promise.all(promiseArray)
                            .then(
                                results => {
                                    for (let x = 0; x < results.length; x++) {
                                        const females = results[x].data.reduce((total, data) => {
                                            return total + data.females
                                        }, 0)
                                        const males = results[x].data.reduce((total, data) => {
                                            return total + data.males
                                        }, 0)
                                        const obj = {country: countries[x].country, totalPopulation: population[x].population, femalePopulation: females, malePopulation: males, disparity: females / males }
                                        allCountries.push(obj)
                                    }
                                    dispatch({
                                        type: 'GET_COUNTRIES',
                                        payload: allCountries
                                     })
                                }
                            )
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