import React from 'react';
import * as actions from '../actions/countries';
import axios from 'axios';
import { connect } from "react-redux";
import { Bar } from 'react-chartjs-2';

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
            const all = this.props.countries;
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
        const all = this.props.countries; 

        const countryBySex = [];

        let promiseArray = all.map((country, i) => axios.get('http://api.population.io/1.0/population/' + year + '/' + all[i].country + '/'))
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
                    <td style={{paddingLeft: '20px'}}> {i + 1}</td>
                    <td> {country.country}</td>
                    <td>{country.population}</td>
                </tr>
            )
        })

        return (
                <div className='dashboard-wrapper'>
                    <div className='main'>
                        <table className='top-countries'>
                            <tbody>
                                <tr>
                                    <th>Rank</th>
                                    <th>Country</th>
                                    <th>Population</th>
                                </tr>
                            {top}
                            </tbody>
                        </table> 
                    {this.state.chartData ? <div className="chart-dashboard">
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
                                },
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div> : null}
                    </div>

                <div className='main'>
                    <h1>{this.state.rankOne[0].country}</h1>
                    <h1>Humam Sex Ratio of {this.state.rankOne[0].disparity}</h1>
                    {this.state.mostData ? <div className="chart-dashboard">
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
                                },
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }]
                                }
                            }}
                        />
                    </div> : null}
                </div>
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