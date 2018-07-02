import React from 'react';
import * as actions from '../actions/countries';
import axios from 'axios';
import { connect } from "react-redux";
import { Bar } from 'react-chartjs-2';
import _ from 'lodash';




class Dashboard extends React.Component {

    state={
        top: [],
        chartData: '', 
        rankOne: ' '
    }

    componentDidMount(){
        this.getHighest();
        this.mostMales();
    }

    getHighest (){
            const all = this.props.population;
            const top = all.sort(function (a, b) {
                return b.population - a.population;
            }).filter((item, i) => {
                return i < 10
            })
            const names = top.map(item => item.country);
            const numbers = top.map(item => item.population);
            this.setState({
                chartData: {
                    labels: names,
                    datasets: [
                        {
                            data: numbers,
                            backgroundColor: [
                                'rgba(10, 99, 244, 0.6)',
                                'rgba(20, 99, 132, 0.6)',
                                'rgba(124, 99, 132, 0.6)',
                                'rgba(6, 244, 45, 0.6)',
                                'rgba(78, 99, 132, 0.6)',
                                'rgba(42, 99, 55, 0.6)',
                                'rgba(25, 19, 132, 0.6)',
                                'rgba(188, 99, 132, 0.6)',
                                'rgba(9, 99, 255, 0.6)',
                                'rgba(20, 162, 42, 0.6)'
                            ]
                        }
                    ]
                }, top: top
            })
    }

    mostMales = () =>{
        var today = new Date();
        var year = today.getFullYear();
        const ignore = ['ASIA', 'AFRICA', 'EUROPE', 'World', "Less developed regions", "Less developed regions, excluding China", "Less developed regions, excluding least developed countries", 'Least developed countries', 'More developed regions', 'LATIN AMERICA AND THE CARIBBEAN', 'NORTHERN AMERICA', 'South-Central Asia', 'Southern Asia', 'Eastern Asia', 'Sub-Saharan Africa', 'South-Eastern Asia', 'South America', 'Eastern Africa', 'Western Africa', 'Eastern Europe', 'Western Asia', 'Northern Africa', 'Western Europe', 'Central America', 'Middle Africa', 'Southern Europe', 'Northern Europe', 'Central Asia', 'Southern Africa', 'South Africa', 'OCEANIA']

        const filtered = [];

        const filteredCountries = this.props.countries.map(country => {
            if (!_.includes(ignore, country)) {
                const obj = {country: country}
                return filtered.push(obj)
            }
        })


        const countryBySex = [];

        let promiseArray = filtered.map(country => axios.get('http://api.population.io/1.0/population/' + year + '/' + country.country + '/'))
        Promise.all(promiseArray)
            .then(
                results => {

                    for(let x = 0; x<results.length; x++){
                        const females = results[x].data.reduce((total, data) => {
                            return total + data.females
                        }, 0)
                            const males = results[x].data.reduce((total, data) => {
                            return total + data.males
                        }, 0)
                        const obj = { country: results[x].data[0].country, femalePopulation: females, malePopulation: males, disparity: females / males}
                        countryBySex.push(obj)
                    }                    
                    const rankOne = countryBySex.sort(function (a, b) {
                        return b.disparity - a.disparity;
                    }).filter((item, i) => {
                        return i === 0
                    })

                    this.setState({
                        rankOne,
                        mostData: {
                            labels: ['Males', 'Females'],
                            datasets: [
                                {
                                    data: [rankOne[0].malePopulation, rankOne[0].femalePopulation],
                                    backgroundColor: [
                                        'rgba(10, 99, 244, 0.6)',
                                        'rgba(187, 99, 132, 0.6)'
                                    ]
                                }
                            ]
                        }
                    })
                }
            )
    }
    
    
    
    render() {

        const top = this.state.top.map((country, i)=>{
            return(
                <tr key={country.country}>
                    <td> {country.country}</td>
                    <td>{country.population}</td>
                </tr>
            )
        })

        return (
                <div className='wrapper'>
                    <div className='main'>
                        <table className='top-countries'>
                            <tbody>
                                <tr>
                                    <th>Country</th>
                                    <th>Population</th>
                                </tr>
                            {top}
                            </tbody>
                        </table> 
                    <h1>Most males compared to females are in - {this.state.rankOne[0].country}.</h1>
                    </div>
                {this.state.chartData && this.state.mostData ? <div className="chart-dashboard">
                    <Bar
                        data={this.state.chartData}
                        height={400}
                        options={{
                            title: {
                                display: true,
                                text: 'Top 10 Countries by Population',
                                fontSize: 15,
                                fontColor: 'white'
                            },
                            legend: {
                                display: false
                            }
                        }}
                    />
                    <Bar
                        data={this.state.mostData}
                        height={400}
                        options={{
                            title: {
                                display: true,
                                text: 'Most Males',
                                fontSize: 15,
                                fontColor: 'white'
                            },
                            legend: {
                                display: false
                            }
                        }}
                    />
                </div> : null}
                </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        countries: state.countries,
        population: state.population
    }
};


export default connect(mapStateToProps, actions)(Dashboard)